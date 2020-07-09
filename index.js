if (!localStorage.getItem('contents')) 
    localStorage.setItem('contents', 'Current display name: none'); 

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#result').innerHTML = localStorage.getItem('contents'); 
    
    document.querySelector('#form').onsubmit = () => {
    

        const request = new XMLHttpRequest();
        const displayname = document.querySelector('#displayname').value; 
        request.open('POST', '/displayname');

        request.onload = () => {
            const data = JSON.parse(request.responseText);

                const contents = `Current display name: ${data.displayname}`;
                document.querySelector('#result').innerHTML = contents;
                localStorage.setItem('contents', contents); 
           
        }

        const data = new FormData();
        data.append('displayname', displayname);

        request.send(data);
        return false;
       
    };
});

