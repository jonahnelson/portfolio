import Header from "../Fragments/High Level/Header";
import Content from "../Fragments/High Level/Content";
import Footer from "../Fragments/High Level/Footer";

const Main = ({user, setUser, setSignedIn, setIsAdmin, isAdmin, database, currentTime, currentDate, currentYear, getTime, getDate, getYear}) => {
    return(
        <>
            <Header setIsAdmin={setIsAdmin} currentTime={currentTime} currentDate={currentDate} currentYear={currentYear} user={user}
                setSignedIn={setSignedIn} isAdmin={isAdmin} setUser={setUser}/>
            <Content user={user} database={database} setUser={setUser}
                        isAdmin={isAdmin} currentDate={currentDate} currentYear={currentYear} getDate={getDate} getYear={getYear} getTime={getTime} />
            <Footer/>
        </>
    )
}

export default Main;