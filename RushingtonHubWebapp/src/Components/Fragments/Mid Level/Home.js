import React, {useEffect, useState} from 'react'
import { PlusCircleIcon, ThumbUpIcon, ThumbDownIcon, XCircleIcon, ChatIcon, DotsHorizontalIcon, NewspaperIcon, SpeakerphoneIcon, ScaleIcon, BellIcon } from '@heroicons/react/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Home = ({database, user, getDate, getYear, getTime, selectedSection, setSelectedSection, selectedPost, setSelectedPost}) => {
    const [criminalCharges, setCriminalCharges] = useState([]);
    const [posts, setPosts] = useState();
    const [filteredPosts, setFilteredPosts] = useState();
    const [announcements, setAnnouncements] = useState([]);
    const [notifications, setNotifications] = useState();
    const [postPopupBodyOpen, setPostPopupBodyOpen] = useState(false);
    const [postText, setPostText] = useState('');
    const [numberOfPostsShown, setNumberOfPostsShown] = useState(12);
    const [selectedFilter, setSelectedFilter] = useState('Most Recent');
    const [postsLoaded, setPostsLoaded] = useState(false);
    const [notificationsLoaded, setNotificationsLoaded] = useState(false);
    const [unseenNotifications, setUnseenNotifications] = useState(false);
    const [announcementsLoaded, setAnnouncementsLoaded] = useState(false);
    const [criminalChargesLoaded, setCriminalChargesLoaded] = useState(false);
    const rushingtonEpoch = 1522648800;

    const navigationSections = [
        {sectionName: 'Public Posts', sectionSelected: selectedSection == 'Public Posts', icon: NewspaperIcon},
        {sectionName: 'Government Announcements', sectionSelected: selectedSection == 'Government Announcements', icon: SpeakerphoneIcon},
        {sectionName: 'Criminal Charges', sectionSelected: selectedSection == 'Criminal Charges', icon: ScaleIcon},
        {sectionName: 'Notifications', sectionSelected: selectedSection == 'Notifications', icon: BellIcon},
    ]

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    useEffect(updateValues, []);
    useEffect(()=>{updateFilteredPosts(posts, numberOfPostsShown)}, [selectedFilter]);

    function updateValues(){
        console.log('Called updateValues()')
        database.ref(`/citizens/${user.citizenID}/notifications`).get().then(notificationsSnapshot => {
            if(notificationsSnapshot.val() != undefined){
                setNotifications(Object.values(notificationsSnapshot.val()).sort((notification1, notification2) => {
                    return notification2.ssre - notification1.ssre
                }));
            }
            if(selectedSection == 'Notifications'){
                database.ref(`/citizens/${user.citizenID}/notifications`).get().then(notificationsSnapshot => {
                    if(notificationsSnapshot.val() != undefined){
                        const notifications = Object.values(notificationsSnapshot.val());
                        notifications.forEach(notification => {
                            notification.seen = true;
                        });
                        setUnseenNotifications(false);
                        database.ref(`/citizens/${user.citizenID}/notifications`).set(notifications);
                        setNotifications(notifications.sort((notification1, notification2) => {
                            return notification2.ssre - notification1.ssre
                        }));
                    }
                })
            } else {
                if(notificationsSnapshot.val() != undefined){updateUnseenNotifications(Object.values(notificationsSnapshot.val()))};
            }
            setNotificationsLoaded(true);
        database.ref('/posts').get().then(postsSnapshot => {
            if(postsSnapshot.val() != undefined){
                console.log('Retrieved', Object.values(postsSnapshot.val()).length, 'posts, showing', numberOfPostsShown);

                setPosts(Object.values(postsSnapshot.val()).sort((post1, post2)=>{
                    return post2.ssre - post1.ssre
                }).slice(0, 100));
                updateFilteredPosts(Object.values(postsSnapshot.val()).sort((post1, post2)=>{
                    return post2.ssre - post1.ssre
                }), numberOfPostsShown);
            }
            setPostsLoaded(true);
            database.ref('/announcements').get().then(announcementsSnapshot => {
                if(announcementsSnapshot.val() != undefined){
                    setAnnouncements(Object.values(announcementsSnapshot.val()).sort((announcement1, announcement2) => {
                        return(
                            announcement2.ssre - announcement1.ssre
                        );
                    }).slice(0, 100));
                }
                setAnnouncementsLoaded(true);
                database.ref('/criminalCharges').get().then(criminalChargesSnapshot => {
                    if(criminalChargesSnapshot.val() != undefined){
                        setCriminalCharges(Object.values(criminalChargesSnapshot.val()).sort((charge1, charge2) => {
                            return charge2.ssre - charge1.ssre
                        }));
                    }
                    setCriminalChargesLoaded(true);
                    
                });
            })
        });
    })
    }

    function updateFilteredPosts(postsInput, numberOfPostsShown){
        if(postsInput){
            const sortedPosts = [...postsInput.sort((post1, post2)=>{
                return post2.ssre - post1.ssre;})]                
            if(selectedFilter == 'Most Liked'){
                sortedPosts.sort((post1, post2) => {
                    const post1Likes = post1.liked != undefined ? Object.values(post1.liked).length : 0;
                    const post2Likes = post2.liked != undefined ? Object.values(post2.liked).length : 0;
                    return post2Likes - post1Likes;
                });} else if (selectedFilter == 'Most Disliked'){
                    sortedPosts.sort((post1, post2) => {
                        const post1Dislikes = post1.disliked != undefined ? Object.values(post1.disliked).length : 0;
                        const post2Dislikes = post2.disliked != undefined ? Object.values(post2.disliked).length : 0;
                        return post2Dislikes - post1Dislikes;
                    });
                }
            setFilteredPosts(sortedPosts.slice(0, numberOfPostsShown));
            }
        
    }

    function censor(citizenID){
        return(user.citizenID != citizenID ? `CI-***${citizenID.substring(6, 8)}` : citizenID);
    }

    function makeReadableTimeAgo(post){
        const secondsSincePost = Math.round(((new Date()).getTime()/1000)-rushingtonEpoch) - post.ssre;
        if(secondsSincePost > 2591999){
            return(`${post.datePosted}`);
        } else if(secondsSincePost > 307199){
            const yearsAgo = toFixed(secondsSincePost/307200, 0);
            return(`${yearsAgo} Rushington ${yearsAgo != 1 ? 'years' : 'year'} ago`);
        } else if(secondsSincePost > 38399){
            const monthsAgo = toFixed(secondsSincePost/38400, 0);
            return(`${monthsAgo} Rushington ${monthsAgo != 1 ? 'months' : 'month'} ago`);
        } else if(secondsSincePost > 1199){
            const daysAgo = toFixed(Math.round(((new Date()).getTime()/1000)-rushingtonEpoch)/1200, 0) - 
                toFixed(post.ssre/1200, 0);
            return(`${daysAgo} Rushington ${daysAgo != 1 ? 'days' : 'day'} ago`);
        } else if(secondsSincePost > 59){
            const minutesSincePost = toFixed(secondsSincePost/60, 0);
            return(`${minutesSincePost} ${minutesSincePost != 1 ? 'minutes' : 'minute'} ago`);
        } else {
            return(`${secondsSincePost} ${secondsSincePost != 1 ? 'seconds' : 'second'} ago`);
        }
    }

    function toFixed(num, fixed) {
        var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
        return num.toString().match(re)[0];
    }

    function onClickPost(){
        if(postText != '' && postText != undefined){
            const postID = generatePostID();
            const newPost = {
                postID: postID,
                ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                poster: {
                    citizenID: user.citizenID,
                    name: user.name
                },
                text: postText,
                datePosted: `${getDate()}, ${getYear()}`,
                timePosted: getTime(),
                
            }
            database.ref(`/posts/${postID}`).set(newPost);
            updateValues();
            setPostText('');
        }
    }

    function generatePostID(){
        var postID = 'PO-'
        for(var i = 0; i < 5; i++){
            postID = postID + String(Math.floor(Math.random()*10));
        }
        return(postID);
    }
    
    function updateUnseenNotifications(notifications){
        console.log('Called updateUnseenNotifications()')
        var unseenNotificationsValue = false;
        var count = 0;
        if(notifications != undefined){
        notifications.forEach(notification => {
            if(!notification.seen){
                count++;
                unseenNotificationsValue = true;
            }
        });}
        console.log('Found', count, 'unseen notifications');
        setUnseenNotifications(unseenNotificationsValue);
    }

    function UpOrDownArrow(props){
        if(props.open){
            return <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
              </svg>} else {
            return <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
          }
    }
    
    return(
        <div>
            <div className='grid grid-cols-4 gap-5'>
                <div className='col-span-4 lg:col-span-1 lg:h-40 lg:sticky lg:top-6'>
                    
                    {navigationSections.map(navigationSection => {
                        const Icon = navigationSection.icon;
                        return(
                        
                        <div className='flex-auto lg:flex-none'>
                        <button
                            onClick={()=>{setSelectedSection(navigationSection.sectionName);
                                localStorage.setItem('selectedSection', navigationSection.sectionName);
                                if(navigationSection.sectionName == 'Notifications'){
                                    database.ref(`/citizens/${user.citizenID}/notifications`).get().then(notificationsSnapshot => {
                                        if(notificationsSnapshot.val() != undefined){
                                            const notifications = Object.values(notificationsSnapshot.val());
                                            notifications.forEach(notification => {
                                                notification.seen = true;
                                            });
                                            database.ref(`/citizens/${user.citizenID}/notifications`).set(notifications);
                                            updateValues();
                                        }
                                    })
                                }
                            }}
                            className={classNames(navigationSection.sectionSelected ? 'bg-gray-200' : 'bg-white hover:bg-gray-100',
                                'rounded p-2 w-full text-center lg:text-left'
                            )}
                        >
                            <div className='flex gap-2 justify-center lg:justify-start'>
                                <Icon className='h-6 w-6'
                                    fill={classNames(navigationSection.sectionName == 'Notifications' && unseenNotifications ? '#facc15' : 'white')}
                                />
                            <p className='text-gray-800 font-semibold'>{navigationSection.sectionName}</p>
                            </div>
                            </button>
                        </div>
                        )
                    })}
                    
                </div>
                <div className='col-span-4 lg:col-span-3 bg-gray-100 rounded'>
                    <div className=''>
                        <p className='font-bold py-1 px-2 bg-gray-100 border-b border-gray-400 text-xl'>{selectedSection}</p>
                        {
                            selectedSection == 'Criminal Charges' &&
                            <div className={classNames(criminalChargesLoaded ? '' : 'animate-pulse', 'p-1 lg:p-2')}>
                                {!criminalChargesLoaded &&
                                    <div className='flex justify-center'>
                                    <DotsHorizontalIcon className='h-10 w-10'/>
                                    </div>
                                }
                                {criminalCharges.map(
                                    criminalCharge => {
                                        return(
                                            <div className='p-1 lg:p-2'>
                                                <CriminalCharge charge={criminalCharge}/>
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                        }
                        {
                            selectedSection == 'Public Posts' &&
                            <div className={classNames(postsLoaded ? '' : 'animate-pulse', 'w-full')}>
                                <div className='flow-root p-1 mx-2 my-2'>
                                <textarea className='p-2 rounded w-full focus:ring-1 focus:ring-gray-700 mb-2 border-2 focus:border-gray-700 bg-white shadow-sm focus:outline-none border-gray-500 resize-none'
                                    placeholder='Write post...'
                                    value={postText}
                                    onKeyDown={event => {
                                        if(event.code === 'Enter'){
                                            onClickPost();
                                        }
                                    }}
                                    
                                    onChange={event => {
                                                if(!event.target.value.includes('\n')){
                                                    setPostText(event.target.value);
                                                }
                                    }}
                                ></textarea>
                                <div className='w-full flex pb-2 justify-center'>
                                <button 
                                    onClick={onClickPost}
                                    className={classNames(
                                        postText != '' && postText != undefined ? 'bg-yellow-300 hover:bg-yellow-400' : 'bg-yellow-200 text-gray-400',
                                        'w-64 flex text-md justify-center py-1 font-semibold rounded shadow')}>
                                            <div className='flex justify-center'>
                                    <PlusCircleIcon className='w-6 h-6'/>POST TO EVERYONE
                                    
                                    </div>
                                    </button>
                                    </div>
                                    </div>
                                    {!postsLoaded &&
                                    <div className='flex justify-center'>
                                    <DotsHorizontalIcon className='h-10 w-10'/>
                                    </div>
                                    }
                                    {filteredPosts &&
                                    <div className='w-full'>
                                        <div className='flow-root w-full px-3 py-1'>
                                        <Menu as="div" className={classNames("flex-shrink-0 float-right")}>
                  {({ open }) => (
                    <>
                      <div className='flex justify-center'>
                        <Menu.Button className="bg-white justify-center flex rounded-lg flex px-2 py-2 font-semibold text-sm ring-2 ring-gray ring-opacity-20 focus:outline-none">
                            <p className='text-center'>
                              {selectedFilter}
                            </p>
                            <UpOrDownArrow open={open}/>
                        </Menu.Button>
                      </div>
                      <Transition
                        show={open}
                        as={Fragment}
                        enter="transition ease-out duration-75"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <div className='flex justify-center'>
                          
                        <Menu.Items
                          static
                          className="z-50 absolute justify-center h-auto w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-green ring-opacity-5 focus:outline-none"
                        >
                          <div className='max-h-40'>
                          
                              <Menu.Item>
                            {({ active }) => (
                               <button
                               onClick={()=>{setSelectedFilter('Most Recent')}}
                               className={classNames(
                                 active ? "bg-gray-100" : "",
                                 "block w-full text-left px-4 py-2 text-sm text-green"
                               )}
                             >
                              Most Recent
                             </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                               <button
                               onClick={()=>{setSelectedFilter('Most Liked')}}
                               className={classNames(
                                 active ? "bg-gray-100" : "",
                                 "block w-full text-left px-4 py-2 text-sm text-green"
                               )}
                             >
                              Most Liked
                             </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                               <button
                               onClick={()=>{setSelectedFilter('Most Disliked')}}
                               className={classNames(
                                 active ? "bg-gray-100" : "",
                                 "block w-full text-left px-4 py-2 text-sm text-green"
                               )}
                             >
                              Most Disliked
                             </button>
                            )}
                          </Menu.Item>
                          </div>
                        </Menu.Items>
                        </div>
                      </Transition>
                    </>
                  )}
                </Menu>
                </div>
                {filteredPosts.length != 0 ?
                <div className='w-full p-1 lg:p-2 bg-gray-200'>
                                            
                {filteredPosts.map(
                    post => {
                        return(
                            <div className='p-1 lg:p-2'>
                                <Post post={post}/>
                            </div>
                        )
                    }
                )}
                {numberOfPostsShown < posts.length &&
                <div className='flex justify-center py-2'>
                <button className='px-2 py-1 rounded shadow bg-yellow-300 hover:bg-yellow-400 font-semibold flex'
                    onClick={() => {
                        const newNumberOfPostsShown = numberOfPostsShown + 10;
                        setNumberOfPostsShown(newNumberOfPostsShown);
                        updateFilteredPosts(posts, newNumberOfPostsShown);
                    }}
                >
                    <PlusCircleIcon className='h-6 w-6'/>
                    LOAD MORE POSTS</button>
                </div>
                }
                </div>
                    :
                    <p className='text-gray-700 text-center font-bold py-2 w-full'>NONE YET</p>

                                        }
                                    </div>
                                    }
                                    
                            </div>
                        }
                        {selectedSection == 'Government Announcements' &&
                            <div className={classNames(announcementsLoaded ? '' : 'animate-pulse', 'py-1 lg:py-2')}>
                                {!announcementsLoaded &&
                                    <div className='flex justify-center'>
                                    <DotsHorizontalIcon className='h-10 w-10'/>
                                    </div>
                                }
                                {announcements.map(announcement => {
                                    return(
                                        <div className='px-2 py-1 lg:px-4 lg:py-2'>
                                            <Announcement announcement={announcement}/>
                                        </div>
                                    )
                                })}
                            </div>
                        }
                        {selectedSection == 'Notifications' &&
                            <div className={classNames(notificationsLoaded ? '' : 'animate-pulse')}>
                                {!notificationsLoaded ? 
                                <div className='flex justify-center pt-10'>
                                    <DotsHorizontalIcon className='h-10 w-10'/>
                                </div>  :
                        <div className='px-2 lg:px-4'>
                            
                                {notifications != undefined ? 
                                <div className='py-1 lg:py-2'>
                                    {notifications.map(notification => {
                                        return(
                                            <div className='py-1 lg:py-2'>
                                            <button className='bg-white rounded shadow p-2 w-full'
                                            onClick={()=>{
                                                        
                                                database.ref(`/posts/${notification.post.postID}`).get().then(postSnapshot => {
                                                    if(postSnapshot.val() != undefined){
                                                        setSelectedPost(postSnapshot.val());
                                                        localStorage.setItem('selectedPost', JSON.stringify(postSnapshot.val()));
                                                        window.location.href='/post'
                                                    }
                                                })
                                            }}>
                                                {notification.action == 'commented' ? 
                                                <div className='flex flex-wrap gap-1'>
                                                    <p className='font-bold flex-none flex-wrap'>{notification.actor.name}</p>
                                                    
                                                    <p className='flex-wrap'>commented:</p>
                                                    <p className='text-left flex-wrap font-semibold'>{notification.commentText}</p>
                                                    
                                                    
                                                    </div> :
                                                <div className='flex flex-wrap gap-1'>
                                                    <p className='font-bold flex-none flex-wrap'>{notification.actor.name}</p>
                                                    <p className='flex-none'>{notification.action} your {notification.object}:</p>
                                                    <p className='font-semibold flex justify-start text-left'>{notification.object == 'post' ? notification.post.text : notification.comment.text}</p>
                                                </div>
                                            }
                                                
                                                
                                                <p className='font-semibold text-gray-700 pt-1 text-sm text-left'>{notification.dateAdded} at {notification.timeAdded}</p>
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                                :
                                <div className='text-center font-semibold text-lg py-6 text-gray-700'>NO NOTIFICATIONS YET</div>
                            }
                            </div>
                        }
                    </div>}
                    </div>
                </div>
            </div>
        </div>
    );

    function Post({post}){
        return(
            <div className='rounded bg-white shadow'>
                <a
                    onClick={()=>{
                        setSelectedPost(post);
                        localStorage.setItem('selectedPost', JSON.stringify(post));
                    }}
                    href='/post'>
                <div className='flow-root'>
                     <button
                        onClick={(event) => {
                            event.preventDefault();
                            database.ref(`/citizens/${post.poster.citizenID}`).get().then(citizenSnapshot => {
                                localStorage.setItem('selectedCitizen', JSON.stringify(citizenSnapshot.val()));
                                window.location.href = '/profile';
                            })
                        }}
                     className='px-1 m-1 text-gray-700 text-left font-semibold float-left hover:bg-gray-100 rounded'>
                     <p className=''>{post.poster.citizenID == user.citizenID ? 'Me' : post.poster.name}</p>
                     <p className='text-sm'>{censor(post.poster.citizenID)}</p>
                     </button>
                    <div className='float-right p-2'>
                    <p className='text-right text-gray-700 font-semibold uppercase text-sm'>{makeReadableTimeAgo(post)}</p>
                    </div>
                </div>
                    <div className='px-3 py-1'>
                        <p className='text-lg font-semibold py-2 px-2 border-2 border-gray-400 shadow-sm bg-white'>
                            {post.text}
                        </p>
                    </div>
                    <div className={classNames(post.comments != undefined ? 'border-b border-gray-500' : '', 'w-full flow-root pb-2 pt-5 px-2')}>
                        <button className='flex gap-1 float-left hover:bg-gray-200 rounded p-1'
                            
                            onClick={event=>{
                                event.preventDefault();
                                database.ref(`/posts/${post.postID}`).get().then(postSnapshot => {
                                    const post = postSnapshot.val();
                                var liked = post.liked != undefined ? [...Object.values(post.liked)] : [];
                                var disliked = post.disliked != undefined ? [...Object.values(post.disliked)] : [];
                                if(!liked.includes(user.citizenID)){
                                    liked.push(user.citizenID);
                                    if(disliked.includes(user.citizenID)){
                                        disliked.splice(disliked.indexOf(user.citizenID), 1);
                                    }
                                database.ref(`/posts/${post.postID}/liked`).set(
                                    liked
                                );
                                database.ref(`/posts/${post.postID}/disliked`).set(
                                    disliked
                                );
                                updateValues();
                                if(post.poster.citizenID != user.citizenID){
                                database.ref(`/citizens/${post.poster.citizenID}/notifications`).get().then(notificationsSnapshot => {
                                    const notifications = notificationsSnapshot.val() != undefined ? Object.values(notificationsSnapshot.val()) : [];
                                    notifications.push({
                                        dateAdded: `${getDate()}, ${getYear()}`,
                                        timeAdded: getTime(),
                                        action: 'liked',
                                        object: 'post',
                                        actor: {
                                            name: user.name,
                                            citizenID: user.citizenID
                                        },
                                        post: {postID: post.postID,
                                            text: post.text},
                                        seen: false,
                                        ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                                    });
                                    database.ref(`/citizens/${post.poster.citizenID}/notifications`).set(notifications);
                                })}
                                } else {
                                    liked.splice(liked.indexOf(user.citizenID), 1);
                                    console.log('liked', liked)
                                    database.ref(`/posts/${post.postID}/liked`).set(liked);
                                    updateValues();
                                }
                                })
                            }}
                        >
                            <ThumbUpIcon className='h-6 w-6' 
                                
                                fill={
                                
                                classNames(post.liked != undefined ?
                                Object.values(post.liked).includes(user.citizenID) ? '#facc15' : 'white'
                                : 'white')
                            }/>
                            <p className='font-semibold'>{post.liked != undefined ? Object.values(post.liked).length : 0}</p>
                        </button>
                        <button className='flex gap-1 float-left hover:bg-gray-200 rounded p-1 mx-1'
                            onClick={event=>{
                                event.preventDefault();
                                database.ref(`posts/${post.postID}`).get().then(postSnapshot => {
                                    const post = postSnapshot.val();
                                    var disliked = post.disliked != undefined ? [...Object.values(post.disliked)] : [];
                                var liked = post.liked != undefined ? [...Object.values(post.liked)] : [];
                                if(!disliked.includes(user.citizenID)){
                                    disliked.push(user.citizenID);
                                    if(liked.includes(user.citizenID)){
                                        liked.splice(liked.indexOf(user.citizenID), 1);
                                    }
                                database.ref(`/posts/${post.postID}/disliked`).set(
                                    disliked
                                );
                                database.ref(`/posts/${post.postID}/liked`).set(liked);
                                updateValues();
                                if(post.poster.citizenID != user.citizenID){
                                    database.ref(`/citizens/${post.poster.citizenID}/notifications`).get().then(notificationsSnapshot => {
                                        const notifications = notificationsSnapshot.val() != undefined ? Object.values(notificationsSnapshot.val()) : [];
                                        notifications.push({
                                            dateAdded: `${getDate()}, ${getYear()}`,
                                            timeAdded: getTime(),
                                            action: 'disliked',
                                            object: 'post',
                                            actor: {
                                                name: user.name,
                                                citizenID: user.citizenID
                                            },
                                            post: {postID: post.postID,
                                                text: post.text},
                                            seen: false,
                                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                                        });
                                        database.ref(`/citizens/${post.poster.citizenID}/notifications`).set(notifications);
                                    })}
                                } else {
                                    disliked.splice(disliked.indexOf(user.citizenID), 1);
                                    //console.log('liked', disliked)
                                    database.ref(`/posts/${post.postID}/disliked`).set(disliked);
                                    updateValues();
                                }
                                })
                                
                                
                            }}
                        >
                            <ThumbDownIcon className='h-6 w-6' 
                                
                                fill={
                                
                                classNames(post.disliked != undefined ?
                                Object.values(post.disliked).includes(user.citizenID) ? '#facc15' : 'white'
                                : 'white')
                            }/>
                            <p className='font-semibold'>{post.disliked != undefined ? Object.values(post.disliked).length : 0}</p>
                        </button>
                        <a href={`/post`} className='p-1 gap-1 float-left rounded flex hover:bg-gray-200' onClick={()=>{
                            setSelectedPost(post);
                            localStorage.setItem('selectedPost', JSON.stringify(post));
                        }}>
                            <ChatIcon className='h-6 w-6' fill='white'/>
                            <p className='font-semibold'>{post.comments != undefined ? Object.values(post.comments).length : 0}</p>
                        </a>
                        {
                            post.poster.citizenID == user.citizenID &&
                            <button className='font-semibold bg-yellow-300 hover:bg-yellow-400 rounded shadow flex float-right'
                                onClick={event=>{
                                    event.preventDefault();
                                    database.ref(`/posts/${post.postID}`).set(null);
                                    updateValues();
                                }}
                                >
                                <div className='px-2 py-1 flex'>
                                <XCircleIcon className='h-6 w-6'/>
                                DELETE
                                </div>
                            </button>
                        }
                    </div>
                    {post.comments != undefined &&
                    <div className='p-2'>
                        {
                            Object.values(post.comments).sort((comment1, comment2) => {
                                return comment2.ssre - comment1.ssre;
                            }).sort((comment1, comment2) => {
                                const comment1Likes = comment1.liked != undefined ? Object.values(comment1.liked).length : 0;
                                const comment2Likes = comment2.liked != undefined ? Object.values(comment2.liked).length : 0;
                                return comment2Likes - comment1Likes;
                            }).slice(0, 2).map(comment => {
                                return (<div className='flex gap-3'>
                                    <div className='font-bold flex-none'>{comment.poster.name}</div>
                                    <p className='truncate'>{comment.text}</p>
                                </div>
                                )
                            })
                        }
                        {
                            Object.values(post.comments).length > 2 &&
                            <div className='text-base font-semibold pt-1'>{Object.values(post.comments).length - 2} more...</div>
                        }
                    </div>}
                    </a>
            </div>
        )
    }

    function CriminalCharge({charge}){
    
        return(
            <div className='rounded bg-white shadow text-sm break-words'>
            <div className='w-full'>
            <p className='pl-2 pt-2 font-semibold text-gray-700'>{charge.date} at {charge.time}</p>
            <p className='pl-2 pt-2 font-semibold text-gray-700'>{charge.chargeID} {charge.ssre}</p>
            </div>
            
                {charge.verdict == "Guilty" ?
                <div className='grid grid-cols-2 lg:grid-cols-3 p-2 gap-x-4 gap-y-2'>
                <div className='col-span-1'>
                <p className='font-semibold'>Prosecutor</p>
                <p className=''>{charge.prosecutor.name}</p>
                <p className=''>{censor(charge.prosecutor.citizenID)}</p>
            </div>
            <div className='col-span-1'>
                <p className='font-semibold'>Defendant</p>
                <p className=''>{charge.defendant.name}</p>
                <p className=''>{censor(charge.defendant.citizenID)}</p>
            </div>
            <div className='col-span-2 lg:col-span-1'>
                        <p className='font-semibold'>Crime</p>
                        <p className=''>{charge.crime}</p>
                        </div>
            <div className='col-span-2 lg:col-span-1'>
                        <p className='font-semibold'>Verdict</p>
                        <p className='text-red-700'>Guilty</p>
                        </div>
            

                        
                        <div className='col-span-2 lg:col-span-1'>
                            <p className='font-semibold'>Reason for Verdict</p>
                            <p className=''>{charge.reasonForVerdict}</p>
                        </div>
                        <div className='col-span-2 lg:col-span-1'>
                        <p className='font-semibold'>Sentence</p>
                        <p className=''>{charge.punishment}</p>
                        </div>
            </div> :
            <div className='grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2 p-2'>
            <div className='col-span-1'>
            <p className='font-semibold'>Prosecutor</p>
            <p className=''>{charge.prosecutor.name}</p>
            <p className=''>{censor(charge.prosecutor.citizenID)}</p>
        </div>
        <div className='col-span-1'>
            <p className='font-semibold'>Defendant</p>
            <p className=''>{charge.defendant.name}</p>
            <p className=''>{censor(charge.defendant.citizenID)}</p>
        </div>
        <div className='col-span-2 lg:col-span-1'>
                    <p className='font-semibold'>Alleged Crime</p>
                    <p className=''>{charge.allegedCrime}</p>
                    </div>
        <div className='col-span-2 lg:col-span-1'>
                    <p className='font-semibold'>Verdict</p>
                    <p className='text-green-700'>Not Guilty</p>
                    </div>
                    <div className='col-span-2'>
                        <p className='font-semibold'>Reason for Verdict</p>
                        <p className=''>{charge.reasonForVerdict}</p>
                    </div>
                   
                    </div>
        
                }
    </div>
        )
    
    }

    function Announcement({announcement}){
        return(
            <div className='bg-white rounded shadow p-2'>
                <p className='text-gray-700 font-semibold'>{announcement.datePosted} at {announcement.timePosted}</p>
                <div className='p-2'>
                        <p className='text-lg font-semibold py-2 px-2 border-2 border-gray-400 shadow-sm'>
                            {announcement.text}
                        </p>
                </div>
            </div>
        )
    }
}

export default React.memo(Home);