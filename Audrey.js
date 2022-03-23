var oldUrl=document.location;
var MainUrl='';

function LoadMain(e0){
 e=e0||window.event;
 if(e){if(e.ctrlKey||e.shiftKey)return true;} // если нажата Ctrl или Shift, то загружать в отдельном окне

 if(e0 && e0.stopPropagation){e0.stopPropagation();e0.preventDefault();}       // для DOM-совместимых браузеров
 else window.event.cancelBubble=true; //для IE

 url=getEventTarget(e0);
 if(url.nodeName!='A'&&url.parentNode)url=url.parentNode;

 if(url.href)url=url.href;
 LoadMainUrl(url);
 if(history.pushState)history.pushState(null, null, MainUrl);
 else window.location.hash='#'+MainUrl;
 return false;
}


function ajaxLoad(obj,url,defMessage,post,callback){
  var ajaxObj;
  if(typeof(obj)!="object")obj=document.getElementById(obj);
  if(defMessage)obj.innerHTML=defMessage;
  if(window.XMLHttpRequest){
      ajaxObj = new XMLHttpRequest();
  } else if(window.ActiveXObject){
      ajaxObj = new ActiveXObject("Microsoft.XMLHTTP");
  } else {
      return;
  }
  ajaxObj.open ((post?'POST':'GET'), url);
  if(post&&ajaxObj.setRequestHeader){
    ajaxObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8;");
  }
  ajaxObj.setRequestHeader("Referer", window.location.href);
  ajaxObj.onreadystatechange = ajaxCallBack(obj,ajaxObj,(callback?callback:null));
  ajaxObj.send(post);
  return false;
}
try{
setTimeout( function() {
window.addEventListener("popstate", function(e) {
 MainUrl=e.location || document.location;
 if(oldUrl.pathname==MainUrl.pathname && oldUrl.hash.substring(1,1)!='/'){
    /*alert(oldUrl.pathname+'|'+MainUrl.pathname+'|'+oldUrl.hash);*/
    return;}
 LoadMainUrl(MainUrl.href);
}, false);
}, 900 );
}catch(e){};

function LoadMainUrl(url){
 e=window.location.hostname;
 MainUrl=url;
 i=url.indexOf(e); if(i>0)url=url.substring(i+e.length);
 if(url.substring(0,1)!='/')return;
 i=url.indexOf('#');
 if(i>0)url=url.substring(0,i)+(url.indexOf('?')>=0?'&':'?')+'ajax=1'+url.substring(i);
 else url=url+(url.indexOf('?')>=0?'&':'?')+'ajax=1';
 ajaxLoad('main',url,'Загрузка...')
}

function updateObj(obj, data){
   if(typeof(obj)!="object")obj=document.getElementById(obj); if(!obj)return;
   if(obj.id=='main'){
   var re1=new RegExp ("<title>([^<]+)</title>","i"); text=re1.exec(data);
   if(text!=null){t=text[1]; document.title=t;
    data=data.replace(re1, "");
    }
   obj.innerHTML=data;
   el=document.getElementsByTagName('base')[0];
   if(!el){el=document.createElement("base");
       document.getElementsByTagName('head')[0].appendChild(el);}
   el.setAttribute('href', MainUrl);
   oldUrl=MainUrl;
   window.scroll(0,0);
   return;
   }
   obj.innerHTML = data;
}
function ajaxCallBack(obj, ajaxObj, callback){
return function(){
    if(ajaxObj.readyState==4){
       if(callback) if(!callback(obj,ajaxObj))return;
       if (ajaxObj.status==200){
            updateObj(obj, ajaxObj.responseText);
        }
       else updateObj(obj, ajaxObj.status+' '+ajaxObj.statusText);
    }
;
}}

function getEventTarget(e) {
  var e = e || window.event;
  var target=e.target || e.srcElement;
  if(typeof target == "undefined")return e; // передали this, а не event
  if (target.nodeType==3) target=target.parentNode;// боремся с Safari
  return target;
}
