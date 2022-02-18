const Calendar = ({currentDate, currentYear}) => {
    function classNames(...classes) {
        return classes.filter(Boolean).join(" ");
      }

    const months = [
    {number: 1, name: 'Igmo'},
    {number: 2, name: 'Bostiod'},
    {number: 3, name: 'Walin'},
    {number: 4, name: 'Sabetata'},
    {number: 5, name: 'Carton'},
    {number: 6, name: 'Wayu'},
    {number: 7, name: 'Wildder'},
    {number: 8, name: 'Wekenbarg'},
    {number: 9, name: 'Pape'},
    {number: 10, name: 'Fortis'},
    {number: 11, name: 'Callidus'},
    {number: 12, name: 'Fastis'}
    ];

    function generateDays(){
        var days = [];
        for(var i = 1; i < 25; i++){
            days.push(i);
        }
        return(days)
    }

    function getHoliday(day, monthNumber){
        if(monthNumber == 1 && day == 10){
            return('Dependence Day')
        } else if(monthNumber == 1 && day == 23){
            return('To Day')
        } else if(monthNumber == 2 && day == 3){
            return('Coupon Day')
        } else if(monthNumber == 2 && day == 4){
            return('Government Harassment Day')
        } else if(monthNumber == 2 && day == 30){
            return('Monkey Day')
        } else if(monthNumber == 3 && day == 1){
            return('Day of Stain')
        } else if(monthNumber == 3 && day == 14){
            return('Crisis Day')
        } else if(monthNumber == 4 && day == 15){
            return('Cruelty Day')
        } else if(monthNumber == 4 && day == 22){
            return('Shantik Forest Memorial Day')
        } else if(monthNumber == 5 && day == 19){
            return('Blood Day')
        } else if(monthNumber == 5 && day == 24){
            return('Insurance Day')
        } else if(monthNumber == 6 && day == 5){
            return('Argument Day')
        } else if(monthNumber == 6 && day == 17){
            return('China Day')
        } else if(monthNumber == 7 && day == 1){
            return('Clothes Day')
        } else if(monthNumber == 7 && day == 20){
            return('Thankstaking')
        } else if(monthNumber == 8 && day == 9){
            return('Chive Day')
        } else if(monthNumber == 8 && day == 20){
            return('Jazz Day')
        }
    }

    const days = generateDays();

    function formatDate(month, day){
        var dayString = '' + day;
        console.log(dayString.endsWith('1'));
        if(dayString.endsWith('0') ||
        dayString.endsWith('4') ||
        dayString.endsWith('5') ||
        dayString.endsWith('6') ||
        dayString.endsWith('7') ||
        dayString.endsWith('8') ||
        dayString.endsWith('9')){
          dayString = dayString.concat('th');
        } else if(dayString.endsWith('1')){
          dayString = dayString == '11' ? dayString.concat('th') : dayString.concat('st');
        } else if(dayString.endsWith('2')){
          dayString = dayString == '12' ? dayString.concat('th') : dayString.concat('nd');
        } else if(dayString.endsWith('3')){
          dayString = dayString == '13' ? dayString.concat('th') : dayString.concat('rd');
        }
        return(`${month} ${dayString}`);
      }
    console.log(days);
    return(
        <div className='py-10 px-1 lg:px-16'>
            <div className='flex justify-center'>
            <h className='text-center text-3xl font-bold'>Year {currentYear}</h>
            </div>
             {months.map(month=>{return(
        <div className='py-5'>
           
        <table class="table-fixed w-full border-collapse">

  <thead>
  
    <tr>
      <th className="text-left text-xl">{month.name}</th>
      
    </tr>
  </thead>
  <tbody>
 
  
    {[4, 3, 2, 1].map(week => {
        return(
            <tr className="">
    {days.slice(24-(6*week), 24-(6*week)+6).map(day => {
        return(
            <td className={classNames(currentDate == formatDate(month.name, day) ? 'bg-yellow-300 hover:bg-yellow-400 text-black' : 'bg-white hover:bg-gray-200 text-blue-600',
                "border border-gray-500 px-1 h-24")}>
                    <div className='w-full h-full'>
                <div className=''>
                <p className='text-black'>{day}</p>
                </div>
                <div className=''>
                <p className='break-normal overflow-hidden font-semibold text-xs lg:text-base'>{getHoliday(day, month.number)}</p>
                </div>
                </div>
            </td>
        )
    })}
    </tr>
        )
    })}
  
  
  </tbody>
</table>
</div>
    )})}
    </div>)
}

export default Calendar;