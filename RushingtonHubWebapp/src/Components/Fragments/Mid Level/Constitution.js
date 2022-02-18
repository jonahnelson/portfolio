const Constitution = () => {
    const laws = [
        'No citizen can alter any governmental, business, or residential property that is not their own unless given verbal or written permission by the owner of the property.',
        'No citizen can interact with containers (chests, furnaces, etc.) that aren’t theirs unless given verbal or written permission or they are labeled “Public.”',
        'No citizen can trespass on residential property that isn’t theirs unless given verbal or written permission.',
        'No citizen can own TNT.',
        'No citizen can plot to overthrow the government.',
        'No citizen can farm crops/animals, ride horses, create potions, or create and operate a business, unless they paid for and own a license signed by the dictator of Rushington.',
        'No citizen can kill or hurt anyone else unless by self-defense.',
        'No citizen can take items or property (including animals and mobs) that isn’t their own unless given verbal or written permission.'
    ]

    const rights = [
        'All citizens of Rushington have the right to say whatever they want without punishment, unless what’s said is a threat against others or the government.',
        'All citizens of Rushington have the right to use any of the government services in the government area of Rushington.',
        'All citizens of Rushington, if they own a business license signed by the dictator of Rushington, have the right to create and operate a business on a business lot they paid for, at a price given by the dictator of Rushington.',
        'All citizens of Rushington have the right to buy (at a price given by the dictator of Rushington), own, and alter property that is their own.',
        'All citizens of Rushington have the right to own any item they want, except TNT.',
        'All citizens of Rushington have the right to a fair public trial by the dictator if they feel they were wrongly prosecuted.',
        'All citizens of Rushington have the right to resist being searched by military personnel if they believe it’s unnecessary, although the dictator may issue a search warrant to allow them to do so.',
        'All citizens have the right to go onto any governmental property (except the Town Hall) and business property unless the property is labeled “Private.”',
        'All businesses have the right to refuse service to anyone they want.',
        'All citizens have the right to go onto business properties, as long as business is in mind.',
        'All citizens have the right to alter terrain outside of Rushington.',
        'All citizens have the right to fair treatment under the law.'
    ]

    const policies = [
        'To become a citizen of Rushington, one has to register with the dictator at the registry/licensure. He or she will receive an official certificate of citizenship that contains their information that is signed by the dictator of Rushington. The citizen will then be guaranteed the rights laid out by the Rights section of the Constitution and will be required to follow all laws, or he or she will be punished. It is not required by law that citizens uphold civil responsibilities laid out in the Civil Responsibilities section of the Constitution, but it is preferred.',
        'To create regular currency, a citizen must find/mine/get gold and rename it with an anvil. Gold nuggets are renamed “Meldas”, gold ingots are renamed “Demorias”, and gold blocks are renamed “Rildas.” Each citizen is free to use currency however they please.',
        'To get a property, a citizen must ask which properties are free to use, and the dictator of Rushington will show them which to use based on the purpose (residential vs. business, type of business, etc.) and property balance across the city.',
        'To create a book for the library, a citizen has to put the book in a submission box in the library, and the book will be put in the library in its appropriate genre if it’s approved by the dictator.',
        'To attain a license, a citizen must buy it on the Rushington Hub website. It is illegal for a citizen to do an action that legally requires a license without owning that license.',
        'To sign up for the military, a citizen must meet with the dictator or general at the military office and be trained, approved, and registered.',
        'To become a police officer, a citizen must purchase a Police Officer License on the Rushington Hub website. He or she will be encouraged to wear the now legal netherite armor and will legally be able to reasonably threaten to enact or enact violence to enforce the law. If the Rushington government believes the threat or enaction was not reasonable, however, that is grounds for license revocation.',
        'To use the bank, a citizen drops their gold nuggets, ingots, or blocks into their deposit box at the bank, and the dictator will keep track of the money of each citizen, occasionally granting interest at the cost of the government.'
    ]

    const civilResponsibilities = [
        'All citizens should kill any harmful mobs they see within Rushington.',
        'All citizens should fix any property damage caused by creepers/fire/TNT that they find to the best of their ability.',
        'All citizens should buy residential property and build a home.',
        'All citizens should start a business or get a job as part of an already existing business.',
        'All citizens should use government services.'
    ]

    const constitutionalAdditionsChanges = [
        '(Additional Law). Advisors are citizens in the eyes of the law, but they can legally alter any governmental property as they see fit.',
        '(Additional Right). All citizens have the right to expression. They may wear any skin and armor.',
        '(Additional Law). No citizen can wear/own a green leather cap, as they are only worn by military personnel, and any offense would be stolen valor.',
        '(Additional Right). All citizens have the right to kill any animals/mobs on their property or on governmental/business property that doesn’t clearly belong to that government/business.',
        '(Additional Law). All citizens have to fix any property damage that was caused by a creeper that exploded in an attempt to kill that citizen.',
        '(Additional Law). The most recent edition of the Constitution is the Supreme Law of the Land.',
        '(Additional Right). No citizen of Rushington can be convicted of a crime that was not prohibited previous of the crime.',
        '(Addition to the System of Government). The dictator of Rushington needs the approval of one of the advisors of a punishment when deciding a verdict.',
        '(Clarification of Right 8). No citizen can enter or alter the property that the Town Hall is on (defined the innermost green hedge).',
        '(Addition to the System of Government). The dictator of Rushington has the right to infringe upon a citizen’s right(s) if given permission by both advisors.',
        '(Additional Policy). Citizens have to pay for their residential/business property within a month of beginning the purchase.',
        '(Additional Policy). Citizens have to start paying for a residential/business property within a day of the property being registered to the citizen.',
        '(Additional Law). No citizen can host a business on their business property if he or she does not own a Business and Organization License.',
        '(Additional Law). No citizen can wear netherite armor if he or she is not a licensed police officer.'
    ]
    
    var lawNumber = 0;
    var rightNumber = 0;
    var policyNumber = 0;
    var civilResponsibilityNumber = 0;
    var constitutionalAdditionsChangeNumber = 0;
    return(
        <div className='px-2 lg:px-16 py-8'>
            <p className='font-bold text-2xl text-center'>Constitution of Rushington</p>
            <p className='text-sm text-center font-semibold text-gray-800'>THE SUPREME LAW OF THE LAND</p>
            <p className='font-bold pt-5'>
                System of Government
            </p>
            <div>
                <p>
                    The government of Rushington is a Demoperiatic Oligarchy under the sovereignty of a dictator and a council consisting of two advisors, who are, under the law, citizens. The dictator can create/change laws and any other legal policies. The citizens must follow these laws and legal policies or they will be sentenced to a punishment that the dictator, who acts as a judge, or an appointed licensed judge sees as necessary. The dictator of Rushington can break any laws or legal policies with the permission of both advisors.
                </p>
            </div>
            <p className='font-bold pt-5'>
                Laws
            </p>
            <p className='pb-2'>
                The following laws are enforced by the government and licensed police. Citizens must follow these laws within Rushington or they will be sentenced to a punishment.
            </p>
            {laws.map(law => {
                lawNumber++;
                return(
                    <div>
                    <p>{lawNumber}. {law}</p>
                    </div>
                )
            })}
            <p className='font-bold pt-5'>
                Rights
            </p>
            <p className='pb-2'>
                All citizens of Rushington have the following rights while in Rushington that cannot be infringed upon.
            </p>
            {rights.map(right => {
                rightNumber++;
                return(
                    <div>
                    <p>{rightNumber}. {right}</p>
                    </div>
                )
            })}
            <p className='font-bold pt-5'>
                Policies
            </p>
            <p className='pb-2'>
                The following policies describe important information in the daily life of a Rushington citizen.
            </p>
            {policies.map(policy => {
                policyNumber++;
                return(
                    <div>
                    <p>{policyNumber}. {policy}</p>
                    </div>
                )
            })}
            <p className='font-bold pt-5'>
                Civil Responsibilities
            </p>
            <p className='pb-2'>
                The following civil responsibilities are not required by law to perform, but they are preferred in order to maintain Rushington the best that is possible.
            </p>
            {civilResponsibilities.map(civilResponsibility => {
                civilResponsibilityNumber++;
                return(
                    <div>
                    <p>{civilResponsibilityNumber}. {civilResponsibility}</p>
                    </div>
                )
            })}
            <p className='font-bold pt-5'>
                Constitutional Additions/Changes
            </p>
            <p className='pb-2'>
                The following additions/changes overrule any already existing constitutional ideas.
            </p>
            {constitutionalAdditionsChanges.map(constitutionalAdditionsChange => {
                constitutionalAdditionsChangeNumber++;
                return(
                    <div>
                    <p>{constitutionalAdditionsChangeNumber} {constitutionalAdditionsChange}</p>
                    </div>
                )
            })}
        </div>
    )
}

export default Constitution;