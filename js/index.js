const dayInput = document.getElementById('dayInput');
const monthInput = document.getElementById('monthInput');
const yearInput = document.getElementById('yearInput');
const setError = ({errMessage, inputElement, elementId}={})=>{
    if(!document.getElementById(elementId)){
        const newElement = document.createElement('p');
        newElement.classList.add('text-danger','err-message');
        newElement.setAttribute('id',elementId)
        newElement.innerHTML = errMessage;
        inputElement.parentElement.append(newElement);
        inputElement.parentElement.querySelector('label').classList.add('text-danger');
        inputElement.style.borderColor = 'var(--light-red)';
    }
}
const removeError = (elementId)=>{
    const errorElement = document.getElementById(elementId);
    if(errorElement){
        errorElement.parentElement.querySelector('label').classList.remove('text-danger');
        errorElement.parentElement.querySelector('input').style.borderColor = 'var(--light-gray)';
        errorElement.remove();
    }
}
const validateDay = (dayInput)=>{
    const dayRegex = /^((0?[1-9])|([1-2][0-9])|(3[0-1]))$/;
    const value = dayInput.value;
    if(value==""){
        setError({
            errMessage:'this field is required',
            elementId:'dayInputError',
            inputElement:dayInput
        });
        return false;
    }else if(!dayRegex.test(value)){
        setError({
            errMessage:'Must be a valid day',
            elementId:'dayInputError',
            inputElement:dayInput
        });
        return false;
    }
    return true;
}
const validateMonth = (monthInput)=>{
    const monthRegex = /^((0?[1-9])|(1[0-2]))$/;
    const value = monthInput.value;
    if(value==""){
        setError({
            errMessage:'this field is required',
            elementId:'monthInputError',
            inputElement:monthInput
        });
        return false;
    }else if(!monthRegex.test(value)){
        setError({
            errMessage:'Must be a valid month',
            elementId:'monthInputError',
            inputElement:monthInput
        });
        return false;
    }
    return true;
}
const validateYear = (yearInput)=>{
    const year = yearInput.value;

    if(year==''){
        setError({
            errMessage:'this field is required',
            elementId:'yearInputError',
            inputElement:yearInput
        });
        return false;
    }else if(Number(year)<0){
        setError({
            errMessage:'must be avalid year',
            elementId:'yearInputError',
            inputElement:yearInput
        });
        return false;
    }else if(Number(year) > new Date().getFullYear()){
        setError({
            errMessage:'Must be in the past',
            elementId:'yearInputError',
            inputElement:yearInput
        });
        return false;
    }
    return true;
}
const preventTyping = (inputElement,end)=>{
    return (e)=>{
        if(inputElement.value.length>=2){
            inputElement.value = inputElement.value.slice(0,end);
        }
    }
}
const validateForm = ({dayInput, monthInput, yearInput}={})=>{
    dayInput.addEventListener('input',preventTyping(dayInput,2));
    monthInput.addEventListener('input',preventTyping(monthInput,2));
    yearInput.addEventListener('input',preventTyping(yearInput,4));
}
const inputBlur = ({dayInput, monthInput, yearInput}={})=>{
    dayInput.addEventListener('blur',(e)=>{validateDay(dayInput)});
    monthInput.addEventListener('blur',(e)=>{validateMonth(monthInput)});
    yearInput.addEventListener('blur',(e)=>{validateYear(yearInput)});
}
const inputFocus = ({dayInput, monthInput, yearInput})=>{
    document.querySelectorAll('input').forEach((el)=>{
        el.addEventListener('focus',()=>{
            removeFormError('combinationError');
        });
    });
    dayInput.addEventListener('focus',(e)=>{
        removeError('dayInputError');
    });
    monthInput.addEventListener('focus',(e)=>{
        removeError('monthInputError');
    });
    yearInput.addEventListener('focus',(e)=>{
        removeError('yearInputError');
    });
}
const setFormError = (elementId)=>{
    if(!document.getElementById(elementId)){
        const combinationErrorElement = document.createElement('p');
        const form = document.getElementById('calculatorForm');  
        combinationErrorElement.classList.add('text-danger','err-message');
        combinationErrorElement.setAttribute('id',elementId)
        combinationErrorElement.innerHTML = 'Must be valid Date';
        form.querySelector('div').append(combinationErrorElement);
        form.querySelectorAll('label').forEach(element => {
            element.style.color = 'var(--light-red)';
        });
    }
}
const removeFormError = (elementId)=>{
    const errElement = document.getElementById(elementId);
    if(errElement){
        errElement.parentElement.parentElement.querySelectorAll('label').forEach(element => {
            element.style.color = 'var(--light-gray)';
            errElement.remove();
        });
    }
}
const calcAge = ({dayInput,monthInput,yearInput}={})=>{
    const day = dayInput.value;
    const month = monthInput.value;
    const year = yearInput.value;
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const inputDate = new Date(`${day}-${months[month-1]}-${year}-00:00:00 GMT`);
    const nowDate = new Date();
    const todayDate = new Date(`${nowDate.getDate()}-${months[nowDate.getMonth()]}-${nowDate.getFullYear()}-00:00:00 GMT`);
    if(todayDate.getTime() < inputDate.getTime()){
        return {
            year:-1,
            month:-1,
            day:-1
        }
    }else{
        let dayDifference=0, monthDifference=0, yearDifference=0;
        dayDifference = todayDate.getDate() - inputDate.getDate();
        if(dayDifference<0){
            if(month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11){
                dayDifference+=31;
            }else{
                dayDifference+=30;
            }
            monthDifference-=1;
        }
        monthDifference += todayDate.getMonth() - inputDate.getMonth();
        if(monthDifference<0){
            monthDifference+=12;
            yearDifference-=1;
        }
        yearDifference += todayDate.getFullYear() - inputDate.getFullYear();
        return {
            year:yearDifference,
            month:monthDifference,
            day:dayDifference
        }
    }
}
const displayResults = ({year,month,day}={})=>{
    const spans = document.querySelectorAll('span[id]');
    spans[0].innerHTML = year;
    spans[1].innerHTML = month;
    spans[2].innerHTML = day;    
}
const setUpCombination = ({year,month,day}={})=>{
    year = Number(year);
    month = Number(month);
    day = Number(day);
    if(   (year % 4!=0 && month == 2 && day == 29 )  ||  (  (month == 2 || month == 4 || month == 6 || month == 9 || month == 11) && day == 31) || (month == 2 && day == 30)){
        setFormError('combinationError');
        return false;
    }return true;

}
const clearResults=()=>{
    document.querySelectorAll('span[id]').forEach((el)=>{el.innerHTML = '--'})
}
const submitForm = (e)=>{
    e.preventDefault();
    const isValidDay = validateDay(dayInput);
    const isValidMonth = validateMonth(monthInput);
    const isValidYear = validateYear(yearInput);
    const iscombinationSetUp = setUpCombination({
        day:dayInput.value,
        month: monthInput.value,
        year: yearInput.value
    });
    if(isValidDay&&isValidMonth&&isValidYear&&iscombinationSetUp){
        const {day,month,year} = calcAge({dayInput,monthInput,yearInput});
        if(day==-1&&month==-1&&year==-1){
            setError({
                errMessage:'Must be in the past',
                inputElement:yearInput,
                elementId:'yearInputError'
            });
            clearResults();
        }else{
            displayResults({year,month,day});
        }
    }else{
        setFormError('combinationError');
        clearResults();
    }
}
validateForm({dayInput, monthInput, yearInput});
inputBlur({dayInput, monthInput, yearInput});
inputFocus({dayInput, monthInput, yearInput});
document.forms[0].addEventListener('submit',submitForm);



