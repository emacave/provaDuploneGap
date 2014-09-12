/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



//IL CONTROLLO DEGLI ERRORI E LA MEMORIZZAZIONE LABEL/VARIABILI VA FATTA PRIMAAAAAA
var decode = new Array();
var arr = new Array();
var halt=false;
var a = 0;
var b = 0;
var ip = 0;
var flagZero = 0;
var variabili = new Array();
var stringaIstruzioni="";


$(document).ready(function() {


    $.get("codice.xml", function(xml) {



        arr = controllo(xml);

        if (parseInt(arr[0]) + "" == arr[0])
        {
            if (arr.length === 1)
                alert("L'errore è alla riga " + arr);
            else
                alert("Gli errori sono alle righe " + arr);
            return;
        }

        else
            decode = codifica(xml, arr);
       
            stampaDecode();
        
        
    });
    
    
    $('#run').click(function() {
        
        for(var i=0; i<=decode.length; i++)
        {
            exec();
        }
        
    });
     
    $('#button').click(function() {
        exec();
       
       
    });
});

function stampaDecode()
{
     var stringa="";
    for(var i=0; i<decode.length; i++)
    {
        stringa+='<div class="deco" id="dc'+i+'">'+decode[i]+'</div>'+'<br>';
    
    }
    $('#textDeco').html(stringa);
    
    
    $('#textIst').html(stringaIstruzioni);
}
function exec()
{
    
    if(!halt)
    {
     $('#aVar').text(a);
    $("#bVar").text(b);
    $('#variabili').text(variabili);
    $('#ipVar').text(ip);
    $('.deco').css("background-color", "white");
    $('#dc'+ip+"").css("background-color", "yellow");
  
    $('#ist'+ip+"").css("background-color", "yellow");
   
    switch (decode[ip])
    {
        case "16":             //MOV A, n
            a = parseInt(decode[++ip],10);
            if (a === 0) {
                flagZero = 1;
            }
            break;

        case "17":             //MOV B, n
            b = parseInt(decode[++ip],10);
            if (b === 0) {
                flagZero = 1;
            }
            break;
            ;

        case "12":              //MOV B, A
            b = a;
            break;

        case "11":             //MOV A, B
            a = b;
            break;

        case "31":              //SUB A,B
            a -= b;
            if (a === 0) {
                flagZero = 1;
            }
            break;

        case "21":              //ADD A,B
            a += b;
            if (a === 0) {
                flagZero = 1;
            }
            break;

        case "22":              //ADD B, A
            b += a;
            if (b === 0) {
                flagZero = 1;
            }
            break;

        case "32":              //SUB B,A
            b -= a;
            if (b === 0) {
                flagZero = 1;
            }
            break;

        case "41":              //INC A
            a++;
            if (a === 0) {
                flagZero = 1;
            }
            break;

        case "52":              //INC B
            b++;
            if (b === 0) {
                flagZero = 1;
            }
            break;

        case "72":              //DEC B
            b--;
            if (b === 0) {
                flagZero = 1;
            }
            break;

        case "61":              //DEC A
            a--;
            if (a === 0) {
                flagZero = 1;
            }
            break;

        case "92":              //JNZ   
            if (flagZero === 0) {
                ip = decode[++ip];
                flagZero = 0;
            }
            break;

        case "91":              //JZ
            if (flagZero === 1) {
                ip = decode[++ip];
                flagZero = 0;
            }
            break;

        case "90":              //JMP
            ip = decode[++ip];
            break;

        case "FF":              //HALT
            halt=true;
            break;

        case "00":              //NOP
            break;

        case "19":              //MOV var, A
              variabili[arr[decode[++ip]][1]]=a;
            
            break;

        case "1A":
             variabili[arr[decode[++ip]][1]]=b; //MOV var, B
            break;

        case "13":
            a=variabili[arr[decode[++ip]][1]] ; //MOV A, var
            break;

        case "1E":                      //MOV B, var
            b=variabili[arr[decode[++ip]][1]];
            break;
    }

    
   
    ip++;
    
    if(ip>decode.length)
    {
        halt=true;
    }
}

    
}


function isHere(s, arr)                                 //Funzione di controllo che mi serve per sapere se la stringa s è contenuta nell'array arr
{
    for (var i = 0; i < arr.length; i++)
    {
        if ((s.toString()) == arr[i][0].toString())
            return false;
    }
    return true;
}



function controllo(xml)
{
    var ip = 0;                         //serve a segnalare la riga del primo errore                 
    var err = new Array();            //l'array in cui sono presenti gli errori
    var vari = new Array();            //l'array sarà una matrice dove ogni elemento di questo array sarà un puntatore ad un altro array
    var jmp = new Array();             //array di controllo dedicato alle jmp per vedere se ci sono jmp in eccesso alle label
    var i = 0;                           //puntatore degli errori
    var j = 0;                           //puntatore delle label
    var k = 0;                           //puntatore delle variabili in memoria
    var h = 0;                           //puntatore delle jmp
    var incre = 0;                        //incrementa quando trova un operazione a doppio codice 

    $(xml).find('istruzione').each(function() {               //eseguo per ogni istruzione

        ip++;

        try {
            var nome = $(this).attr('nome').toUpperCase();
        }     //leggo quale l'istruzione
        catch (err) {
            err[i] = ip;
            i++;
            return;
        }                     //se non trovo l'attributo ritorno all'inizio    

        try {
            var op1 = $(this).attr('op1').toUpperCase();
        }    //leggo il primo operando
        catch (err) {
            var op1 = "/e/";
        }                          //se non trovo l'attriputo op1 (cioè op1 non presente") perchè alcune istruzioni non lo richiedono

        try {
            var op2 = $(this).attr('op2').toUpperCase();
        }    //leggo il secondo operando
        catch (err) {
            var op2 = "/e/";
        }                          //se non trovo l'attriputo op2 gli assegno "/e/" (cioè op2 non presente") perchè alcune istruzioni non lo richiedono

        /////////////////MOV//////////////////////////

        if (nome === "MOV")
        {
            if (parseInt(op1) + "" == op1)
            {
                err[i] = ip;
                i++;
                return;
            }

            if (op1 === "/e/" || op2 === "/e/")
            {
                err[i] = ip;
                i++;
                return;
            }

            if (op1 === "A" || op1 === "B")
            {
                if (parseInt(op2) + "" == op2)
                {
                    incre++;
                    return;
                }
                if (op2 === "A" || op2 === "B")
                    return;

                if (isHere(op2, vari))                                   //Se la stringa da inserire è già presente non la inserisco
                {
                    vari[j] = new Array();                               //Inserisco la label della variabile nella matrice creando un vettore di vettore
                    vari[j][0] = op2;
                    vari [j][1] = k;
                    j++;
                    k++;
                    incre++;
                    return;
                }
            }

            else
            {
                if (op2 === "A" || op2 === "B")
                {
                    if (isHere(op1, vari))                         //Se la stringa da inserire è già presente non la inserisco
                    {
                        vari[j] = new Array();                 //Inserisco la label della variabile nella matrice creando un vettore di vettore
                        vari[j][0] = op1;
                        vari [j][1] = k;
                        j++;
                        k++;
                        incre++;
                        return;
                    }
                }
                else
                {
                    err[i] = ip;
                    i++;
                    return;
                }
            }

        }

        /////////////////LABEL//////////////////////////

        if (nome === "LABEL")
        {
            if (op1 === "/e/")
            {
                err[i] = ip;
                i++;
                return;
            }
            if (op2 !== "/e/")
            {
                err[i] = ip;
                i++;
                return;
            }
            if (parseInt(op1) + "" == op1)
            {
                err[i] = ip;
                i++;
                return;
            }

            if (isHere(op1, vari))                         //Se la stringa da inserire è già presente non la inserisco
            {
                vari[j] = new Array();                 //Inserisco la label della variabile nella matrice creando un vettore di vettore
                vari[j][0] = op1;
                vari [j][1] = ip + incre;
                j++;
                return;
            }
        }

        /////////////////JMP-JNZ-JZ//////////////////////////

        if (nome === "JMP" || nome === "JNZ" || nome === "JZ")
        {
            if (op1 === "/e/")
            {
                err[i] = ip;
                i++;
                return;
            }
            if (op2 !== "/e/")
            {
                err[i] = ip;
                i++;
                return;
            }
            if (parseInt(op1) + "" == op1)
            {
                err[i] = ip;
                i++;
                return;
            }

            jmp[h] = new Array();                 //Inserisco la label della variabile nella matrice creando un vettore di vettore       
            jmp[h][0] = op1;
            jmp [h][1] = ip;
            h++;
            incre++;
            return;

        }

        /////////////////SUB//////////////////////////

        if (nome === "SUB")
        {
            if (op1 !== "A" && op1 !== "B")
            {
                err[i] = ip;
                i++;
                return;
            }
            else if (op2 !== "A" && op2 !== "B")
            {
                err[i] = ip;
                i++;
                return;
            }
        }

        /////////////////ADD//////////////////////////

        if (nome === "ADD")
        {
            if (op1 !== "A" && op1 !== "B")
            {
                err[i] = ip;
                i++;
                return;
            }
            else if (op2 !== "A" && op2 !== "B")
            {
                err[i] = ip;
                i++;
                return;
            }
        }

        /////////////////INC//////////////////////////

        if (nome === "INC")
        {
            if (op1 !== "A" && op1 !== "B")
            {
                err[i] = ip;
                i++;
                return;
            }
            if (op2 !== "/e/")
            {
                err[i] = ip;
                i++;
                return;
            }
        }

        /////////////////DEC//////////////////////////

        if (nome === "DEC")
        {
            if (op1 !== "A" && op1 !== "B")
            {
                err[i] = ip;
                i++;
                return;
            }
            if (op2 !== "/e/")
            {
                err[i] = ip;
                i++;
                return;
            }
        }

        /////////////////NOP//////////////////////////

        if (nome === "NOP")
        {
            if (op1 !== "/e/" && op2 !== "/e/")
            {
                err[i] = ip;
                i++;
                return;
            }
        }

        /////////////////HALT//////////////////////////

        if (nome === "HALT")
        {
            if (op1 !== "/e/" && op2 !== "/e/")
            {
                err[i] = ip;
                i++;
                return;
            }
        }

        /////////////////SE NON E' RICONOSCIUTA L'ISTRUZIONE//////////////////////////

        if (nome !== "HALT" && nome !== "JMP" && nome !== "JZ" && nome !== "JNZ" && nome !== "DEC" && nome !== "INC" && nome !== "ADD" && nome !== "SUB" && nome !== "MOV" && nome !== "NOP")                                 //se non è entrato in nessun if vuol dire che l'attributo nome non è corretto
        {
            err[i] = ip;
            i++;
            return;
        }



    });

    /////////////////CONTROLLO DELLE JMP//////////////////////////
    var conta = 0;
    for (var k = 0; k < jmp.length; k++)
    {
        conta = 0;
        for (var j = 0; j < vari.length; j++)
        {
            if ((vari[j][0].toString()) === (jmp[k][0].toString()))
                conta++;
        }
        if (conta === 0)
        {
            err[i] = jmp[k][1];
            i++;
        }
    }


//        alert ("err");
//        for (var i = 0; i < err.length; i++)  //stampa
//        {
//            alert (err[i]);
//        }
//        alert ("var");
//        for (var i = 0; i < vari.length; i++)  //stampa
//        {
//            for (var j = 0; j < 2; j++)
//                alert(vari[i][j]);
//        }

    if (err.length === 0)
        return vari;
    else
        return err;

}





function search(s, v)
{
    var a = new Array(v);
    for (var i = 0; i < v.length; i++)
    {
        if ((s.toString()) == v[i][0].toString())
            return v[i][1];
    }
    return -1;

}


function codifica(xml, arr)
{

    var ip = 0;
    var decode = new Array();
    var op1="";
    var op2="";
    $(xml).find('istruzione').each(function() {             //eseguo per ogni istruzione

        var nome = $(this).attr('nome').toUpperCase();     //leggo quale istruzione è
        op1 = $(this).attr('op1').toUpperCase();       //gli operandi
        try {
             op2 = $(this).attr('op2').toUpperCase();
        }
        catch (err)
        {
        }
        stringaIstruzioni+='<div class="deco" id="ist'+ip+'">'+nome+' '+op1+','+op2+'</div>'+'<br>';
        
        ////////////////////////MOV///////////////////////////////////////
        if (nome === "MOV")
        {
            if (op1 === "A")
            {
                if (op2 === "B")
                {
                    decode[ip] = "10";
                    ip++;
                    return;
                }
                if (parseInt(op2) + "" == op2)
                {
                    decode[ip] = "16";
                    ip++;
                    decode[ip] = op2.toString(16);
                    ip++;
                    return;
                }
                else
                {
                    decode[ip] = "13";
                    ip++;
                    decode[ip] = search(op2, arr);
                    ip++;
                    return;
                }
            }

            else if (op1 === "B")
            {
                if (op2 === "A")
                {
                    decode[ip] = "12";
                    ip++;
                    return;
                }
                if (parseInt(op2) + "" == op2)
                {
                    decode[ip] = "17";
                    ip++;
                    decode[ip] = op2.toString(16);
                    ip++;
                    return;
                }
                else
                {
                    decode[ip] = "1E";
                    ip++;
                    decode[ip] = search(op2, arr);
                    ip++;
                    return;
                }
            }

            else
            {
                if (op2 === "A")
                {
                    decode[ip] = "19";
                    ip++;
                    decode[ip] = search(op1, arr);
                    ip++;
                    return;
                }
                else
                {
                    decode[ip] = "1A";
                    ip++;
                    decode[ip] = search(op1, arr);
                    ip++;
                    return;
                }
            }


        }

        //////////////////////INC///////////////////////

        if (nome === "INC")
        {
            if (op1 === "A")
            {
                decode[ip] = "41";
                ip++;
                return;
            }
            else
            {
                decode[ip] = "52";
                ip++;
                return;
            }
        }

        //////////////////////DEC///////////////////////

        if (nome === "DEC")
        {
            if (op1 === "A")
            {
                decode[ip] = "61";
                ip++;
                return;
            }
            else
            {
                decode[ip] = "72";
                ip++;
                return;
            }
        }

        /////////////////SUB//////////////////////////

        if (nome === "SUB")
        {
            if (op1 === "A")
            {
                decode[ip] = "31";
                ip++;
                return;
            }
            if (op1 === "B")
            {
                decode[ip] = "32";
                ip++;
                return;
            }
        }

        /////////////////ADD//////////////////////////

        if (nome === "ADD")
        {
            if (op1 === "A")
            {
                decode[ip] = "21";
                ip++;
                return;
            }
            if (op1 === "B")
            {
                decode[ip] = "22";
                ip++;
                return;
            }
        }

        /////////////////JMP//////////////////////////

        if (nome === "JMP")
        {
            decode[ip] = "90";
            ip++;
            decode[ip] = (search(op1, arr));
            ip++;
            return;
        }

        /////////////////JZ//////////////////////////

        if (nome === "JZ")
        {
            decode[ip] = "91";
            ip++;
            decode[ip] = (search(op1, arr));
            ip++;
            return;
        }

        /////////////////JNZ//////////////////////////

        if (nome === "JNZ")
        {
            decode[ip] = "92";
            ip++;
            decode[ip] = (search(op1, arr));
            ip++;
            return;
        }


        /////////////////HALT//////////////////////////

        if (nome === "HALT")
        {
            decode[ip] = "FF";
            ip++;
            return;
        }

        /////////////////NOP//////////////////////////

        if (nome === "NOP")
        {
            decode[ip] = "00";
            ip++;
            return;
        }

        if (nome === "LABEL")
            return;

    });


    return decode;
}