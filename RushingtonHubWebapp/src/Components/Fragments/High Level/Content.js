import React from "react";
import Panel from "../Mid Level/Panel";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";


const Content = ({
  isAdmin,
  currentDate,
  currentYear,
  user,
  database,
  getTime,
  getDate,
  getYear,
  setUser
}) => {
  
  return (
    <main className="-mt-24 lg:pb-8 bg-blue-200">
      <div className="max-w-3xl mx-auto px-2 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="sr-only">Page title</h1>
        {/* Main 3 column grid */}
        <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
          {/* Left column */}
          <Router>
            <Switch>
              <Route exact path={['/bank', '/constitution', '/calendar', '/resources', '/', '/profile', isAdmin ? '/government' : '', '/licenses', '/post', '/map', '/properties', '/citizens', '/settings', '/businesses', '/business']}
                render={(props)=>{return(
                  <div className="grid grid-cols-1 gap-4 lg:col-span-3 py-2 lg:pt-5">
                  <section aria-labelledby="section-1-title">
                    <h2 className="sr-only" id="section-1-title">
                      Section title
                    </h2>
                    <div className="border-2 border-gray-700 bg-white shadow">
                      <div className="p-2 lg:p-6">
                        {
                          /* Your content */
                          <Panel isAdmin={isAdmin}
                                      user={user}
                                      database={database}
                                      getTime={getTime}
                                      getYear={getYear}
                                      getDate={getDate}
                                      currentYear={currentYear}
                                      currentDate={currentDate}
                                      setUser={setUser}
                                      />
                        }
                      </div>
                    
                    </div>
                
                  </section>
                </div>
                );}}/>
              
          </Switch>
          </Router>
        </div>
        
      </div>
    </main>
  );
};

export default Content;
