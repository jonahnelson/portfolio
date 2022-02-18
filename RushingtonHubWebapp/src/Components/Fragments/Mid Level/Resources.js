import { BookOpenIcon, CalendarIcon, CreditCardIcon, LibraryIcon, MapIcon, OfficeBuildingIcon, UsersIcon, CashIcon } from "@heroicons/react/outline"

const Resources = ({}) => {
    const resources = [
        {name: 'Bank', subtext: "Transfer money, see balance, and see transfer history", icon: LibraryIcon, href: '/bank'},
        {name: 'Businesses', subtext: "Add businesses and buy from other businesses", icon: CashIcon, href: '/businesses'},
        {name: 'Licenses', subtext: "Buy new Rushington licenses and see purchased ones", icon: CreditCardIcon, href: '/licenses'},
        {name: 'Citizens', subtext: "See all Rushington citizens and their profiles", icon: UsersIcon, href: '/citizens'},
        {name: 'Map', subtext: "Full map of Rushington", icon: MapIcon, href: '/map'},

        // Properties. Might unhide if I ever add everyone's properties to their file
        // {name: 'Properties', subtext: "See Rushington properties, which are owned, and which are available", icon: OfficeBuildingIcon, href: '/properties'},
        
        {name: 'Constitution', subtext: "Rushington's system of government, laws, rights, and policies", icon: BookOpenIcon, href: '/constitution'},
        {name: 'Calendar', subtext: "Rushington's yearly calendar by month and day", icon: CalendarIcon, href: '/calendar'},
    ]
    return(
        <div>
            <div>
                {resources.map(resource => {
                    return(
                    <div className='px-2 lg:px-20 py-2'>
                    <a className=''
                        href={resource.href}
                    >
                        <div className='w-full rounded bg-yellow-300 hover:bg-yellow-400 shadow py-6 px-2'>
                        <div className='flex justify-center'>
                            <resource.icon className='h-7 w-7'/>
                            <p className='font-bold text-xl pl-1'>{resource.name}</p>
                        </div>
                        <p className='text-center text-gray-700'>{resource.subtext}</p>
                        </div>
                    </a>
                    </div>)
                })}
            </div>
        </div>
    )
}

export default Resources;