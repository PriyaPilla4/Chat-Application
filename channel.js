document.addEventListener('DOMContentLoaded', () => {

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    
    socket.on( 'connect', function() {
        let channel = $( 'input.channel' ).val() 
        socket.emit( 'my event', {
            data: 'User Connected',
            channel : channel
        });
       
        var form = $( 'form' ).on( 'submit', function( e ) {
            e.preventDefault()

            let channel = $( 'input.channel' ).val() 
            let user_name = $( 'input.username' ).val()
            let user_input = $( 'input.message' ).val()

            var et = document.getElementById("emoji");
            var emoji = et.options[et.selectedIndex].value;

            socket.emit('my event', { 
                user_name : user_name,
                message : user_input,
                channel : channel,
                emoji : emoji    
            });
           
            $( 'input.message' ).val( '' ).focus()
        });

    });

    socket.on( 'my response', function( msg ) {
        console.log( msg ) 
        if( typeof msg.message !== 'undefined' ) {

            var now = new Date();
            var timeNow = now.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            var time_now = timeNow.fontsize(1.5);

            if (typeof msg.emoji !== 'none'){
                if (msg.emoji == "smiley_face") {
                    $( 'div.message_holder' ).append( '<br> '+'<b style="color: #D12D0A">'+msg.user_name+'</b>'+': '+msg.message+" "+"&#128522"+' '+'   '+'<b>'+time_now+'</b>' +'</div>' )
                } else if (msg.emoji == "winking_face"){
                    $( 'div.message_holder' ).append( '<br> '+'<b style="color: #D12D0A">'+msg.user_name+'</b>'+': '+msg.message+" "+"&#128521"+' '+'   '+'<b>'+time_now+'</b>' +'</div>' )
                } else if (msg.emoji == "heart_eyes_face"){
                    $( 'div.message_holder' ).append( '<br> '+'<b style="color: #D12D0A">'+msg.user_name+'</b>'+': '+msg.message+" "+"&#128525"+' '+'   '+'<b>'+time_now+'</b>' +'</div>' )
                }else if(msg.emoji == "laughing_face"){
                    $( 'div.message_holder' ).append( '<br> '+'<b style="color: #D12D0A">'+msg.user_name+'</b>'+': '+msg.message+" "+"&#128514"+' '+'   '+'<b>'+time_now+'</b>' +'</div>' )
                }
            }

            if (msg.emoji == "none"){
                $( 'div.message_holder' ).append( '<br> '+'<b style="color: #D12D0A">'+msg.user_name+'</b>'+': '+msg.message+' '+'   '+'<b>'+time_now+'</b>' +'</div>' )
            }
        }
    });

});
