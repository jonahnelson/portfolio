import RushingtonMap from '../../../RushingtonMap.png'

const Map = ({}) => {
    return(
        <div className='p-5'>
            <p className='font-bold text-3xl text-center pb-7'>Map of Rushington</p>
                <img src={RushingtonMap}
                    className='rounded'
                ></img>
        </div>
    )
}

export default Map;