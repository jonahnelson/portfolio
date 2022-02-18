import { useState, useEffect } from "react";
import { ThumbDownIcon, ThumbUpIcon, ChatIcon, XCircleIcon, PlusCircleIcon, XIcon, NewspaperIcon, SpeakerphoneIcon, ScaleIcon, BellIcon, ReplyIcon } from "@heroicons/react/outline";

const PostPage = ({selectedSection, setSelectedSection, selectedPost, setSelectedPost, notifications, setValues, user, database, getTime, getDate, getYear}) => {

    const navigationSections = [
        {sectionName: 'Public Posts', sectionSelected: selectedSection == 'Public Posts', icon: NewspaperIcon},
        {sectionName: 'Government Announcements', sectionSelected: selectedSection == 'Government Announcements', icon: SpeakerphoneIcon},
        {sectionName: 'Criminal Charges', sectionSelected: selectedSection == 'Criminal Charges', icon: ScaleIcon},
        {sectionName: 'Notifications', sectionSelected: selectedSection == 'Notifications', icon: BellIcon},
    ]

    useEffect(updatePost, []);
    const rushingtonEpoch = 1522648800;

    function onClickPostComment(commentText){
        if(commentText != undefined && commentText != ''){
        database.ref(`/posts/${selectedPost.postID}/comments`).get().then(commentsSnapshot => {
            const commentID = generateCommentID();
            const newComment = {
                commentID: commentID,
                text: commentText,
                poster: {
                    name: user.name,
                    citizenID: user.citizenID
                },
                datePosted: `${getDate()}, ${getYear()}`,
                timePosted: getTime(),
                ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
            }
            database.ref(`/posts/${selectedPost.postID}/comments/${commentID}`).set(newComment);
            updatePost();
            if(selectedPost.poster.citizenID != user.citizenID){
                database.ref(`/citizens/${selectedPost.poster.citizenID}/notifications`).get().then(notificationsSnapshot => {
                    const notifications = notificationsSnapshot.val() != undefined ? Object.values(notificationsSnapshot.val()) : [];
                    notifications.push({
                        dateAdded: `${getDate()}, ${getYear()}`,
                        timeAdded: getTime(),
                        action: 'commented',
                        object: 'post',
                        commentText: commentText,
                        actor: {
                            name: user.name,
                            citizenID: user.citizenID
                        },
                        post: {postID: selectedPost.postID,
                            text: selectedPost.text},
                        seen: false,
                        ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                    });
                    database.ref(`/citizens/${selectedPost.poster.citizenID}/notifications`).set(notifications);
                })}
        })
        }
    }

    function generateCommentID(){
        var postID = 'CO-'
        for(var i = 0; i < 5; i++){
            postID = postID + String(Math.floor(Math.random()*10));
        }
        return(postID);
    }

    function updatePost(){
        database.ref(`/posts/${selectedPost.postID}`).get().then(postSnapshot => {
            setSelectedPost(postSnapshot.val());
            localStorage.setItem('selectedPost', JSON.stringify(postSnapshot.val()));
        })
    }

    function unseenNotifications(){
        var unseenNotificationsValue = false;
        if(user.notifications != undefined){
        Object.values(user.notifications).forEach(notification => {
            if(!notification.seen){
                unseenNotificationsValue = true;
            }
        });}
        return unseenNotificationsValue;
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

    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
    }

    function censor(citizenID){
        return(user.citizenID != citizenID ? `CI-***${citizenID.substring(6, 8)}` : citizenID);
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
                                                user.notifications = notifications;
                                                localStorage.setItem('user', JSON.stringify(user));
                                            }
                                        })
                                    }
                                    window.location.href = '/';
                                }}
                                className='w-full'
                            >
                        <div
                            className={classNames(navigationSection.sectionSelected ? 'bg-gray-200' : 'bg-white hover:bg-gray-100',
                                'rounded p-2 w-full text-center lg:text-left'
                            )}
                        >
                            <div className='flex gap-2 justify-center lg:justify-start'>
                                <Icon className='h-6 w-6'
                                    fill={classNames(navigationSection.sectionName == 'Notifications' && unseenNotifications() ? '#facc15' : 'white')}
                                />
                            <p className='text-gray-800 font-semibold'>{navigationSection.sectionName}</p>
                            </div></div>
                            </button>
                        </div>
                        )
                    })}
                    
                </div>
                <div className='col-span-4 lg:col-span-3 bg-gray-100 rounded'>
                    <div className=''>
                        <p className='font-bold py-1 px-2 bg-gray-100 border-b border-gray-400 text-xl'>{selectedPost.poster.name}'s Post</p>
                        <Post/>
                    </div>
                </div>
            </div>
        </div>
    );

function Post({}){
    const [commentText, setCommentText] = useState();
    console.log(selectedPost.postID)
    return(
        <div className='border-b border-l border-r border-gray-400 bg-white shadow'>
            <div className='flow-root'>
            <button
                        onClick={(event) => {
                            event.preventDefault();
                            database.ref(`/citizens/${selectedPost.poster.citizenID}`).get().then(citizenSnapshot => {
                                localStorage.setItem('selectedCitizen', JSON.stringify(citizenSnapshot.val()));
                                window.location.href = '/profile';
                            })
                        }}
                     className='px-1 m-1 text-gray-700 text-left font-semibold float-left hover:bg-gray-100 rounded'>
                     <p className=''>{selectedPost.poster.citizenID == user.citizenID ? 'Me' : selectedPost.poster.name}</p>
                     <p className='text-sm'>{censor(selectedPost.poster.citizenID)}</p>
                     </button>
                     <div className='float-right p-2'>
                    <p className='text-right text-gray-700 font-semibold uppercase text-sm'>{makeReadableTimeAgo(selectedPost)}</p>
                    </div>
            </div>
                <div className='px-3 py-1'>
                    <p className='text-lg font-semibold py-2 px-2 border-2 border-gray-400 shadow-sm'>
                        {selectedPost.text}
                    </p>
                </div>
                <div className='w-full flow-root pb-2 pt-5 px-2 border-b border-gray-500'>
                    <button className='flex gap-1 float-left hover:bg-gray-200 rounded p-1'
                        onClick={()=>{
                            database.ref(`/posts/${selectedPost.postID}`).get().then(postSnapshot => {
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
                                updatePost();
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
                                    updatePost();
                                }
                                })
                        }}
                    >
                        <ThumbUpIcon className='h-6 w-6' 
                            
                            fill={
                            
                            classNames(selectedPost.liked != undefined ?
                            Object.values(selectedPost.liked).includes(user.citizenID) ? '#facc15' : 'white'
                            : 'white')
                        }/>
                        <p className='font-semibold'>{selectedPost.liked != undefined ? Object.values(selectedPost.liked).length : 0}</p>
                    </button>
                    <button className='flex gap-1 float-left hover:bg-gray-200 rounded p-1 mx-1'
                        onClick={()=>{
                            database.ref(`/posts/${selectedPost.postID}`).get().then(postSnapshot => {
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
                                updatePost();
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
                                    updatePost();
                                }
                                })
                            
                            
                        }}
                    >
                        <ThumbDownIcon className='h-6 w-6' 
                            
                            fill={
                            
                            classNames(selectedPost.disliked != undefined ?
                            Object.values(selectedPost.disliked).includes(user.citizenID) ? '#facc15' : 'white'
                            : 'white')
                        }/>
                        <p className='font-semibold'>{selectedPost.disliked != undefined ? Object.values(selectedPost.disliked).length : 0}</p>
                    </button>
                    <div className='p-1 gap-1 float-left rounded flex'>
                            <ChatIcon className='h-6 w-6'/>
                            <p className='font-semibold'>{selectedPost.comments != undefined ? Object.values(selectedPost.comments).length : 0}</p>
                        </div>
                    {
                        selectedPost.poster.citizenID == user.citizenID &&
                        <button className='font-semibold bg-yellow-300 hover:bg-yellow-400 rounded shadow flex float-right'
                            onClick={()=>{
                                database.ref(`/posts/${selectedPost.postID}`).set(null);
                                updatePost();
                            }}
                            >
                            <div className='px-2 py-1 flex'>
                            <XCircleIcon className='h-6 w-6'/>
                            DELETE
                            </div>
                        </button>
                    }
                </div>
                <div className='p-2 bg-gray-100'>
                    <p className='font-semibold text-lg pb-2 text-gray-700'>Comments</p>
                        <textarea className='rounded resize-none bg-white focus:outline-none h-16 w-full p-2 bg-gray-100 border-2 border-gray-500 focus:border-gray-700 focus:ring-1 focus:ring-gray-700'
                            placeholder='Write comment...'
                            value={commentText}
                            onKeyDown={event => {
                                if(event.code === 'Enter'){
                                    onClickPostComment(commentText);
                                }
                            }}
                            
                            onChange={event => {
                                        if(!event.target.value.includes('\n')){
                                            setCommentText(event.target.value);
                                        }
                            }}
                        ></textarea>
                        <div className='flex justify-center w-full p-1'>
                        <button 
                                    onClick={()=>{onClickPostComment(commentText)}}
                                    className={classNames(
                                        commentText != '' && commentText != undefined ? 'bg-yellow-300 hover:bg-yellow-400' : 'bg-yellow-200 text-gray-400',
                                        'w-64 flex text-md justify-center py-1 font-semibold rounded shadow')}>
                                            <div className='flex justify-center'>
                                    <PlusCircleIcon className='w-6 h-6'/>POST COMMENT
                                    
                                    </div>
                                    </button>
                            </div>

                        {selectedPost.comments != undefined ?
                        <div className='pt-8'>
                            {Object.values(selectedPost.comments).sort((comment1, comment2) => {
                                return comment2.ssre - comment1.ssre;
                            }).map(comment => {
                                return(
                                <div className='p-1 mt-2 bg-white rounded shadow'>
                                    <div className='flow-root w-full pb-1'>
                                    <button
                        onClick={(event) => {
                            event.preventDefault();
                            database.ref(`/citizens/${comment.poster.citizenID}`).get().then(citizenSnapshot => {
                                localStorage.setItem('selectedCitizen', JSON.stringify(citizenSnapshot.val()));
                                window.location.href = '/profile';
                            })
                        }}
                     className='text-gray-700 p-1 text-left font-semibold float-left hover:bg-gray-100 rounded'>
                     <p className=''>{comment.poster.citizenID == user.citizenID ? 'Me' : comment.poster.name}</p>
                     <p className='text-sm'>{censor(comment.poster.citizenID)}</p>
                     </button>
                                    <div className='float-right'>
                                    <div className='float-right px-1'>
                                        <p className='text-right text-gray-700 font-semibold uppercase text-sm'>{makeReadableTimeAgo(comment)}</p>
                                    </div>
                                    </div>
                                    </div>
                                    <p className='p-2 mx-2 my-1 bg-white border-2 border-gray-400 shadow-sm font-semibold'>{comment.text}</p>
                                    <div className='flow-root m-0.5 pt-2'>
                                    <button className='flex gap-1 float-left hover:bg-gray-200 rounded p-1'
                        onClick={()=>{
                            database.ref(`/posts/${selectedPost.postID}/comments/${comment.commentID}`).get().then(commentSnapshot => {
                                const comment = commentSnapshot.val();
                                var liked = comment.liked != undefined ? [...Object.values(comment.liked)] : [];
                                var disliked = comment.disliked != undefined ? [...Object.values(comment.disliked)] : [];
                                if(!liked.includes(user.citizenID)){
                                    liked.push(user.citizenID);
                                    if(disliked.includes(user.citizenID)){
                                        disliked.splice(disliked.indexOf(user.citizenID), 1);
                                    }
                                database.ref(`/posts/${selectedPost.postID}/comments/${comment.commentID}/liked`).set(
                                    liked
                                );
                                database.ref(`/posts/${selectedPost.postID}/comments/${comment.commentID}/disliked`).set(
                                    disliked
                                );
                                updatePost();
                                if(comment.poster.citizenID != user.citizenID){
                                database.ref(`/citizens/${comment.poster.citizenID}/notifications`).get().then(notificationsSnapshot => {
                                    const notifications = notificationsSnapshot.val() != undefined ? Object.values(notificationsSnapshot.val()) : [];
                                    notifications.push({
                                        dateAdded: `${getDate()}, ${getYear()}`,
                                        timeAdded: getTime(),
                                        action: 'liked',
                                        object: 'comment',
                                        actor: {
                                            name: user.name,
                                            citizenID: user.citizenID
                                        },
                                        post: {postID: selectedPost.postID,
                                            text: selectedPost.text
                                        },
                                        comment: {commentID: comment.commentID,
                                            text: comment.text},
                                        seen: false,
                                        ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                                    });
                                    database.ref(`/citizens/${comment.poster.citizenID}/notifications`).set(notifications);
                                })}
                                } else {
                                    liked.splice(liked.indexOf(user.citizenID), 1);
                                    console.log('liked', liked)
                                    database.ref(`/posts/${selectedPost.postID}/comments/${comment.commentID}/liked`).set(liked);
                                    updatePost();
                                }
                                })
                        }}
                    >
                        <ThumbUpIcon className='h-5 w-5' 
                            
                            fill={
                            
                            classNames(comment.liked != undefined ?
                            Object.values(comment.liked).includes(user.citizenID) ? '#facc15' : 'white'
                            : 'white')
                        }/>
                        <p className='font-semibold text-sm'>{comment.liked != undefined ? Object.values(comment.liked).length : 0}</p>
                    </button>
                    <button className='flex gap-1 float-left hover:bg-gray-200 rounded p-1 ml-0.5'
                        onClick={()=>{
                            database.ref(`/posts/${selectedPost.postID}/comments/${comment.commentID}`).get().then(commentSnapshot => {
                                const comment = commentSnapshot.val();
                                var disliked = comment.disliked != undefined ? [...Object.values(comment.disliked)] : [];
                                var liked = comment.liked != undefined ? [...Object.values(comment.liked)] : [];
                                if(!disliked.includes(user.citizenID)){
                                    disliked.push(user.citizenID);
                                    if(liked.includes(user.citizenID)){
                                        liked.splice(liked.indexOf(user.citizenID), 1);
                                    }
                                database.ref(`/posts/${selectedPost.postID}/comments/${comment.commentID}/disliked`).set(
                                    disliked
                                );
                                database.ref(`/posts/${selectedPost.postID}/comments/${comment.commentID}/liked`).set(liked);
                                updatePost();
                                if(comment.poster.citizenID != user.citizenID){
                                    database.ref(`/citizens/${comment.poster.citizenID}/notifications`).get().then(notificationsSnapshot => {
                                        const notifications = notificationsSnapshot.val() != undefined ? Object.values(notificationsSnapshot.val()) : [];
                                        notifications.push({
                                            dateAdded: `${getDate()}, ${getYear()}`,
                                            timeAdded: getTime(),
                                            action: 'disliked',
                                            actor: {
                                                name: user.name,
                                                citizenID: user.citizenID
                                            },
                                            object: 'comment',
                                            post: {postID: selectedPost.postID,
                                                text: selectedPost.text
                                            },
                                            comment: {commentID: comment.commentID,
                                                text: comment.text},
                                            seen: false,
                                            ssre: Math.round(((new Date()).getTime()/1000)-rushingtonEpoch),
                                        });
                                        database.ref(`/citizens/${comment.poster.citizenID}/notifications`).set(notifications);
                                    })}
                                } else {
                                    disliked.splice(disliked.indexOf(user.citizenID), 1);
                                    //console.log('liked', disliked)
                                    database.ref(`/posts/${selectedPost.postID}/comments/${comment.commentID}/disliked`).set(disliked);
                                    updatePost();
                                }
                                })
                            
                            
                        }}
                    >
                        <ThumbDownIcon className='h-5 w-5' 
                            
                            fill={
                            
                            classNames(comment.disliked != undefined ?
                            Object.values(comment.disliked).includes(user.citizenID) ? '#facc15' : 'white'
                            : 'white')
                        }/>
                        <p className='font-semibold text-sm'>{comment.disliked != undefined ? Object.values(comment.disliked).length : 0}</p>
                    </button>
                        {comment.poster.citizenID == user.citizenID &&
                                    <button className='float-right text-sm rounded shadow bg-yellow-300 hover:bg-yellow-400 font-semibold flex px-2 py-1'
                                        onClick={() => {
                                            database.ref(`/posts/${selectedPost.postID}/comments/${comment.commentID}`).set(null);
                                            updatePost();
                                        }}
                                    >
                                        <XCircleIcon className='h-5 w-5'/>
                                        DELETE
                                    </button>}
                                    </div>
                                    
                                </div>
                                )
                            })}
                        </div>
                        :
                        <p className='w-full text-center font-semibold text-gray-700 py-8'>NO COMMENTS</p>  
                    }
                    </div>
        </div>
    )
}
}


export default PostPage;