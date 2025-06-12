import Security from './../images/switch1.jpeg'
import { Link } from 'react-router-dom';

const Home = () => {
    return(
        <>
        <div className="text-center">
            <h2>Login and find the application you like to work on</h2>
            <hr />
            <Link to='/login'>
                <img src={Security} alt='security'></img>
            </Link>
        </div>
        </>
    )
}
export default Home;