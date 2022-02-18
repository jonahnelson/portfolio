import { LibraryIcon, CheckCircleIcon, CreditCardIcon, PencilAltIcon, PlusCircleIcon, ThumbUpIcon, ThumbDownIcon, ChatIcon, XCircleIcon, DotsHorizontalIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";

const Profile = ({user, database, getDate, getYear, getTime}) => {
    const rushingtonEpoch = 1522648800;

    const [selectedCitizen, setSelectedCitizen] = useState(localStorage.getItem('selectedCitizen') != undefined ? JSON.parse(localStorage.getItem('selectedCitizen')) : {});

    const [selectedSection, setSelectedSection] = useState('Posts');
    const [editingBiography, setEditingBiography] = useState(false);
    const [posts, setPosts] = useState();
    const [postsLoaded, setPostsLoaded] = useState(false);
    const [newBiography, setNewBiography] = useState(selectedCitizen.biography != undefined ? selectedCitizen.biography : undefined);
    
    useEffect(updateValues, []);
    
    function censor(citizenID){
        return(user.citizenID != citizenID ? `CI-***${citizenID.substring(6, 8)}` : citizenID);
    }

    function updateValues(){
        database.ref(`/citizens/${selectedCitizen.citizenID}`).get().then(citizenSnapshot => {
            setSelectedCitizen(citizenSnapshot.val());
            localStorage.setItem('selectedCitizen', JSON.stringify(citizenSnapshot.val()));
            setNewBiography(citizenSnapshot.val().biography);
            database.ref('/posts').get().then(postsSnapshot => {
                setPosts(Object.values(postsSnapshot.val()).filter(post => {
                    return post.poster.citizenID == selectedCitizen.citizenID;
                }).sort((post1, post2) => {
                    return post2.ssre - post1.ssre;
                }));
                setPostsLoaded(true);
            })
        })
    }

    function makeReadableTimeAgo(post){
        const secondsSincePost = Math.round(((new Date()).getTime()/1000)-rushingtonEpoch) - post.ssre;
        if(secondsSincePost > 3455999){
            return(`${post.datePosted}`);
        } else if(secondsSincePost > 345599){
            const yearsAgo = toFixed(secondsSincePost/345600, 0);
            return(`${yearsAgo} Rushington ${yearsAgo != 1 ? 'years' : 'year'} ago`);
        } else if(secondsSincePost > 28799){
            const monthsAgo = toFixed(secondsSincePost/28800, 0);
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
    
    return(
        <div className='bg-white rounded lg:px-20'>
            <div className='py-2'>
            <div className='flex justify-center text-3xl font-bold'>
                {selectedCitizen.name}
            </div>
            <div className='flex justify-center text-lg'>
                {censor(selectedCitizen.citizenID)}
            </div>
            </div>
            {editingBiography ?
            <div className='w-full'>
            <textarea className='rounded resize-none border-2 text-center border-gray-500 h-20 w-full p-2 focus:outline-none focus:ring-1 focus:ring-gray-700 focus:border-gray-700'
                onChange={
                    event => {
                        setNewBiography(event.target.value);
                    }
                }
                placeholder={classNames(selectedCitizen.biography != undefined ? 'Edit biography...' : 'Add biography...')}
                value={newBiography}
            >

            </textarea>
            
            </div>
             :
             null
            }
            <div className='border-b border-gray-500 lg:mx-2 pb-2'>
            {selectedCitizen.biography != undefined && !editingBiography &&
            <div className='flex justify-center'>
            <p className='p-2 border-gray-500 border-2 font-semibold text-center shadow'>{selectedCitizen.biography}</p>
            </div>
            }
            
            {selectedCitizen.citizenID == user.citizenID ?
                editingBiography ?
                <div className='flex gap-2 justify-center'>
                    <button className='bg-yellow-300 hover:bg-yellow-400 font-semibold p-2 flex justify-center rounded my-1 text-sm shadow'
                onClick={() => {
                    setEditingBiography(false);
                }}
            >
                <XCircleIcon className='h-5 w-5'/>
                CANCEL</button>
            <button className={classNames(newBiography != undefined && newBiography != '' ? 'bg-yellow-300 hover:bg-yellow-400' :
                'bg-yellow-200 text-gray-400', 'font-semibold p-2 flex justify-center rounded my-1 text-sm shadow')}
                onClick={() => {
                    if(newBiography != undefined && newBiography != ''){
                        database.ref(`/citizens/${user.citizenID}/biography`).set(newBiography);
                        setEditingBiography(false);
                        updateValues();
                    }
                }}
            >
                <CheckCircleIcon className='h-5 w-5'/>
                SAVE</button>
                </div> :
            selectedCitizen.biography == undefined ?
            <div className='flex justify-center'>
            <button className='bg-yellow-300 hover:bg-yellow-400 shadow text-sm font-semibold p-2 flex justify-center rounded my-1'
                onClick={() => {
                    setEditingBiography(true);
                }}
            >
                <PlusCircleIcon className='h-5 w-5'/>
                ADD BIO</button></div> : 
                <div className='flex justify-center my-2'>
                    <button className='bg-yellow-300 hover:bg-yellow-400 text-sm font-semibold flex rounded p-2 shadow justify-center'
                        onClick={() => {
                            setEditingBiography(true);
                        }}
                    >
                        <PencilAltIcon className='h-5 w-5'/>
                        EDIT BIO
                    </button></div> : null
        }
            
        </div>
        
            
            
            <div className='pt-8 lg:mx-2 border-b border-gray-500'>
                <button className={classNames(
                    selectedSection == 'Posts' ? 'border-b-4 border-yellow-300 font-bold hover:bg-gray-100 rounded-t' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded',
                    'w-1/2 py-1')}
                    onClick={() => {
                        setSelectedSection('Posts');
                    }}
                    >POSTS</button>
                <button className={classNames(
                    selectedSection == 'File' ? 'border-b-4 border-yellow-300 font-bold hover:bg-gray-100 rounded-t' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded',
                    'w-1/2 py-1')}
                    onClick={() => {
                        setSelectedSection('File');
                    }}
                    >FILE</button>

            </div>
            <div>
                {selectedSection == 'File' &&
                    <div className='pt-2'>
                                        <div className='text-lg'>
                                            
                                            <div className='grid grid-cols-3 lg:m-2 border-2 border-gray-400'>
                                            <div className='col-span-1 p-2'>
                                                <p className='font-semibold'>Name</p>
                                                <p>{selectedCitizen.name}</p>
                                            </div>
                                            <div className='col-span-1 p-2'>
                                                <p className='font-semibold'>Citizen ID</p>
                                                <p>{censor(selectedCitizen.citizenID)}</p>
                                            </div>
                                            <div className='col-span-1 p-2'>
                                                <p className='font-semibold'>Date Added</p>
                                                <p>{selectedCitizen.dateAdded}</p>
                                            </div>
                                            </div>
                                        </div>
                                        <div className='py-2'>
                                            <div className='grid grid-cols-2'>
                                            <div className='col-span-2 py-2 lg:px-2'>
                                                
                                                <div className='bg-white'>
                                                    
                                                    <div className='w-full flow-root p-2 bg-gray-200'>
                                                    <p className='font-semibold float-left'>BANK</p>
                                                    <div className='float-right flex gap-1'>
                                                        <a 
                                                            href='/bank'
                                                            className='bg-yellow-300 py-1 px-2 flex text-sm hover:bg-yellow-400 font-semibold rounded shadow'>
                                                            <LibraryIcon className='w-5 h-5'/>
                                                            GO TO BANK</a>
                                                    </div>
                                                    </div>
                                                    <div className='flow-root p-2 border-2 border-gray-400'>
                                                        <p className='float-left font-semibold text-gray-700'>Balance</p>
                                                        <p className='float-right'>{selectedCitizen.meldas} [M]</p>
                                                    </div>
                                                    <div className='p-2 border-b-2 border-r-2 border-l-2 border-gray-400'>
                                                        <p className='font-semibold text-gray-700'>Transaction History</p>
                                                        {selectedCitizen.transfers != undefined &&
                                                        <div className='max-h-96 overflow-y-scroll bg-gray-100 md:scrollbar-show sm:scrollbar-hide'>
                                                            
                                                            
                                                            
                                                        {Object.values(selectedCitizen.transfers).sort((transfer1, transfer2)=>{
                                                            return(transfer2.ssre - transfer1.ssre);
                                                        }).map(transfer => {
                                                            return(
                                                                <div className='p-1'>
                                                                <Transfer transfer={transfer}/>
                                                                </div>
                                                            )
                                                        })}
                                                        
                                                        
                                                        </div>}
                                                        {selectedCitizen.transfers == undefined &&
                                                        <div className=''>None yet</div>
                                                        }
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            <div className='col-span-2 py-2 lg:px-2'>
                                                
                                                <div className='bg-white'>
                                                <div className='p-2 flow-root w-full bg-gray-200'>
                                                <p className='font-semibold float-left'>CRIMINAL CHARGES</p>
                                                        
                                                    </div>
                                                    <div className='flow-root p-2 border-2 border-gray-400'>
                                                        <p className='float-left font-semibold text-gray-700'>Total</p>
                                                        <p className='float-right'>{selectedCitizen.charges ? Object.values(selectedCitizen.charges).length : 0}</p>
                                                    </div>
                                                    <div className='p-2 border-b-2 border-r-2 border-l-2 border-gray-400'>
                                                        {selectedCitizen.charges != undefined &&
                                                        <div className='max-h-96 overflow-y-scroll bg-gray-100'>
                                                            
                                                            
                                                            
                                                        {Object.values(selectedCitizen.charges).sort((charge1, charge2)=>{
                                                            return(charge2.ssre - charge1.ssre);
                                                        }).map(charge => {
                                                            return(
                                                                <div className='p-1'>
                                                                <CriminalCharge charge={charge}/>
                                                                </div>
                                                            )
                                                        })}
                                                        
                                                        
                                                        </div>}
                                                        {selectedCitizen.charges == undefined &&
                                                        <div className=''>None yet</div>
                                                        }
                                                    </div>
                                                </div>
                                                
                                            
                                            </div>
                                            {
                                                // Property section of profile. Hidden for now because I have to give everyone
                                                // accurate properties which takes time
                                            }
                                            {/* <div className='col-span-2 py-2 lg:px-2'>
                                                
                                                <div className='bg-white'>
                                                <div className='p-2 flow-root w-full bg-gray-200'>
                                                <p className='font-semibold float-left'>PROPERTIES</p>
                                                        
                                                    </div>
                                                    <div className='flow-root p-2 border-2 border-gray-400'>
                                                        <p className='float-left font-semibold text-gray-700'>Total</p>
                                                        <p className='float-right'>{selectedCitizen.properties ? Object.values(selectedCitizen.properties).length : 0}</p>
                                                    </div>
                                                    <div className='p-2 border-b-2 border-r-2 border-l-2 border-gray-400'>
                                                        {selectedCitizen.properties != undefined &&
                                                        <div className='max-h-96 overflow-y-scroll bg-gray-100'>
                                                            
                                                            
                                                            
                                                        {Object.values(selectedCitizen.properties).sort((property1, property2)=>{
                                                            return(property2.ssre - property1.ssre);
                                                        }).map(property => {
                                                            return(
                                                                <div className='w-full text-left group'
                                                                    onClick={()=>{
                                                                        /* setSelectedProperty(findPropertyByID(property.propertyID));
                                                                        setSelectedSection('Properties');
                                                                    }}
                                                                >
                                                                <Property property={property}/>
                                                                </div>
                                                            )
                                                        })}
                                                        
                                                        
                                                        </div>}
                                                        {selectedCitizen.properties == undefined &&
                                                        <div className=''>None yet</div>
                                                        }
                                                    </div>
                                                </div>
                                                
                                            </div> */}
                                            <div className='col-span-2 py-2 lg:px-2'>
                                                
                                                <div className='bg-white'>
                                                <div className='w-full flow-root p-2 bg-gray-200'>
                                                    <p className='font-semibold float-left'>LICENSES</p>
                                                    <div className='float-right flex gap-1'>
                                                        <a 
                                                            href='/licenses'
                                                            className='bg-yellow-300 py-1 px-2 flex text-sm hover:bg-yellow-400 font-semibold rounded shadow'>
                                                            <CreditCardIcon className='w-5 h-5'/>
                                                            GO TO LICENSES</a>
                                                    </div>
                                                    </div>
                                                    <div className='flow-root p-2 border-2 border-gray-400'>
                                                        <p className='float-left font-semibold text-gray-700'>Total</p>
                                                        <p className='float-right'>{selectedCitizen.licenses ? Object.values(selectedCitizen.licenses).length : 0}</p>
                                                    </div>
                                                    <div className='p-2 border-b-2 border-r-2 border-l-2 border-gray-400'>
                                                        {selectedCitizen.licenses != undefined &&
                                                        <div className='max-h-96 overflow-y-scroll bg-gray-100'>
                                                            
                                                            
                                                            
                                                        {Object.values(selectedCitizen.licenses).sort((license1, license2)=>{
                                                            return(license1.title.localeCompare(license2.title));
                                                        }).map(license => {
                                                            return(
                                                                <div className='w-full text-left group'
                                                                    onClick={()=>{
                                                                        /* setSelectedProperty(findPropertyByID(property.propertyID));
                                                                        setSelectedSection('Properties'); */
                                                                    }}
                                                                >
                                                                <License license={license}/>
                                                                </div>
                                                            )
                                                        })}
                                                        
                                                        
                                                        </div>}
                                                        {selectedCitizen.licenses == undefined &&
                                                        <div className=''>None yet</div>
                                                        }
                                                    </div>
                                                </div>
                                                
                                            </div>
                                            </div>
                                        </div>
                                        </div>}
                                        {selectedSection == 'Posts' &&
                                        <div className='lg:px-2'>
                                            {posts != undefined && posts.length != 0 &&
                                                <div className='bg-gray-200 p-1 lg:p-2 rounded-b'>
                                                    {posts.map(post => {
                                                        return(
                                                            <div className='p-1 lg:p-2'>
                                                            <Post post={post}/>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            }
                                            {posts != undefined && posts.length == 0 &&
                                                <div className='bg-gray-200 p-1 lg:p-2 rounded-b'>
                                                    <div className='p-1 lg:p-2'>
                                                        <p className='text-gray-700 font-semibold text-center'>NONE YET</p>
                                                    </div>
                                                </div>
                                            }
                                            {!postsLoaded &&
                                                <div className='bg-gray-200 p-1 lg:p-2 rounded-b animate-pulse flex justify-center'>
                                                    <DotsHorizontalIcon className='h-10 w-10'/>
                                                </div>
                                            }
                                        </div>
                                        }
                                        </div>
                                    </div>
    )

    function Post({post}){
        return(
            <div className='rounded bg-white shadow'>
                <a
                    onClick={()=>{
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
                     className='p-1 m-1 text-gray-700 text-left font-semibold float-left hover:bg-gray-100 rounded'>
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

    function Transfer({transfer}){
    
        return(
            <div className='rounded bg-white text-sm shadow'>
                <div className='w-full'>
                <p className='pl-2 pt-2 font-semibold text-gray-700'>{transfer.date} at {transfer.time}</p>
                <p className='pl-2 pt-2 font-semibold text-gray-700'>{transfer.transferID} {transfer.ssre}</p>
                </div>
                <div className='grid grid-cols-4 gap-y-2 lg:gap-3 p-2'>
                {transfer.type == "Incoming" ?
                <div className='col-span-4 lg:col-span-2 grid grid-cols-2'>
                            <div className='col-span-1'>
                                <p className='font-semibold'>Amount</p>
                                <p className='text-green-700'>+{transfer.amount} [M]</p>
                            </div>
                            <div className='col-span-1'>
                                <p className='font-semibold'>Sender</p>
                                <p className=''>{transfer.senderName}</p>
                            </div>
                            </div>
                :    
                <div className='col-span-4 lg:col-span-2 grid grid-cols-2'>
                <div className='col-span-1'>
                    <p className='font-semibold'>Amount</p>
                    <p className='text-red-700'>-{transfer.amount} [M]</p>
                </div>
                <div className='col-span-1'>
                    <p className='font-semibold'>Receiver</p>
                    <p className=''>{transfer.receiverName}</p>
                </div>
                </div>
                        }
                <div className='col-span-2 lg:col-span-1'>
                                <p className='font-semibold'>Reason</p>
                                <p className=''>{transfer.reason}</p>
                            </div>
                <div className='col-span-2 lg:col-span-1'>
                                <p className='font-semibold'>Resulting Balance</p>
                                <p className=''>{transfer.resultingBalance} [M]</p>
                            </div>
                        </div>
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

    function Property({property}){
        return(
            <div className={classNames('m-2')}>
                                            <div className='w-full bg-white border-2 shadow border-gray-500 grid grid-cols-3'>
                                                <div className='col-span-3 p-2 flow-root'>
                                                    <div className='float-left'>
                                                    <p className={classNames('text-xl', 'font-bold')}>{property.address}</p>
                                                    <p className={classNames('text-sm', 'uppercase font-semibold')}>{property.type}</p>
                                                    </div>
                                                </div>
                                                                                      
                                                <div className='col-span-1 p-2'>
                                                    <p className='font-semibold'>Property ID</p>
                                                    <p>{property.propertyID}</p>
                                                </div>
                                                <div className='col-span-1 p-2'>
                                                    <p className='font-semibold'>Date Property Added</p>
                                                    <p>{property.dateAdded}</p>
                                                </div>
                                                <div className='col-span-1 p-2'>
                                                    <p className='font-semibold'>Date Property Given</p>
                                                    <p>{property.owner.dateAdded}</p>
                                                </div>
                                                {property.type == 'Business' &&
                                                <div className='col-span-3 p-2'>
                                                    <div>
                                                        <p className='font-semibold'>Business Name</p>
                                                        <p>{property.business != undefined ? property.business.name : 'None yet'}</p>
                                                    </div>
                                                    <div>
                                                        <p className='font-semibold pt-3'>Business Description</p>
                                                        <p>{property.business != undefined ? property.business.description : 'None yet'}</p>
                                                    </div>
                                                </div>
                                                }
                                            </div>
                                            </div>
        )
    }

    function License({license}){
        return(
            <div className='border-2 border-gray-500 bg-white shadow p-2 m-2'>
                <div className='flow-root'>
                    <div className='float-left'>
                        <p className='text-lg font-semibold'>{license.title}</p>
                        <p className='font-semibold text-gray-700'>{license.licenseID}</p>
                    </div>
                    <p className='float-right font-bold text-xl'>{license.price} [M]</p>
                </div>
                <div className='flow-root'>
                    <p className='pt-2 pr-2 font-semibold float-left'>{license.permissions}</p>
                    
                    <div className='flex float-right'>
                        <CheckCircleIcon className='w-7 h-7'/>
                    <p className='float-right font-bold px-1 text-lg'>Purchased {(selectedCitizen.licenses[license.licenseID]).datePurchased}</p>
                    </div>
                    
                    
                    
                    
                </div>
            </div>
        )
    }

    
}

export default Profile;