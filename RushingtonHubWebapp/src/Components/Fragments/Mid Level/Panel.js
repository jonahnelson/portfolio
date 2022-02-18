import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Resources from './Resources'
import Bank from './Bank';
import Calendar from './Calendar';
import Constitution from './Constitution';
import Government from './Government';
import Home from './Home'
import Profile from './Profile';
import Licenses from './Licenses';
import PostPage from '../Low Level/PostPage';
import Map from './Map';
import Properties from './Properties';
import Citizens from './Citizens';
import Settings from './Settings';
import Businesses from './Businesses';
import Business from './Business';

const Panel = ({ isAdmin, currentDate, currentYear, user, setUser, citizenID, database, getTime, getDate, getYear }) => {
    const [selectedSection, setSelectedSection] = useState(localStorage.getItem('selectedSection') != undefined ? localStorage.getItem('selectedSection') : 'Public Posts');
    const [selectedPost, setSelectedPost] = useState(localStorage.getItem('selectedPost') != undefined ? JSON.parse(localStorage.getItem('selectedPost')) : undefined);

    return(
        <div className="h-full">
            <Router>
                <Switch>
                    <Route exact path='/' render={(props) => {return <Home{...props} database={database} getDate={getDate} getYear={getYear} getTime={getTime} user={user} selectedSection={selectedSection} setSelectedSection={setSelectedSection} selectedPost={selectedPost} setSelectedPost={setSelectedPost}/>}}></Route>
                    <Route path='/bank' render={(props) => {return <Bank{...props} user={user} citizenID={citizenID} database={database} getDate={getDate} getYear={getYear} getTime={getTime}/>}}></Route>
                    <Route path='/resources' render={(props) => {return <Resources{...props}/>}}></Route>
                    <Route path='/calendar' render={(props) => {return <Calendar{...props} currentDate={currentDate} currentYear={currentYear}/>}}></Route>
                    <Route path='/constitution' render={(props) => {return <Constitution{...props}/>}}></Route>
                    {isAdmin &&
                    <Route path='/government' render={(props) => {return <Government{...props} database={database} getDate={getDate} getYear={getYear} getTime={getTime} user={user} setUser={setUser}/>}}></Route>
                    }
                    <Route path='/profile' render={(props)=>{return <Profile{...props} user={user} database={database} getDate={getDate} getYear={getYear} getTime={getTime}/>}}></Route>
                    <Route path='/licenses' render={(props)=>{return <Licenses{...props} user={user} database={database} getDate={getDate} getYear={getYear} getTime={getTime} setUser={setUser}/>}}></Route>
                    <Route path='/post' render={(props)=>{return <PostPage{...props} user={user} database={database} getTime={getTime} getDate={getDate} getYear={getYear} selectedSection={selectedSection} setSelectedSection={setSelectedSection} selectedPost={selectedPost} setSelectedPost={setSelectedPost}/>}}></Route>
                    <Route path='/map' render={(props) => {return <Map{...props}/>}}></Route>
                    <Route path='/properties' render={(props) => {return <Properties{...props} database={database}/>}}></Route>
                    <Route path='/citizens' render={(props) => {return <Citizens{...props} database={database} user={user}/>}}></Route>
                    <Route path='/settings' render={(props) => {return <Settings{...props} database={database} user={user} setUser={setUser}/>}}></Route>
                    <Route path='/businesses' render={(props) => {return <Businesses{...props} database={database} user={user} setUser={setUser} getTime={getTime} getDate={getDate} getYear={getYear}/>}}></Route>
                    <Route path='/business' render={(props) => {return <Business{...props} database={database} user={user} setUser={setUser} getTime={getTime} getDate={getDate} getYear={getYear}/>}}></Route>
                </Switch>
            </Router>
        </div>
    )
}

export default React.memo(Panel);
