var current_code='';
function TrustLogo(logo,code,autoMove){host=location.host;current_code=code;return tLUC(logo,code,code,autoMove);}function TrustLogo_MouseOver(ev,code){return tLL(ev,code);}function TrustLogo_MouseMove(ev,code){return tLM(ev,code);}function TrustLogo_MouseOut(ev,code){return tLN(ev,code);};function TrustLogo_Credentials(ev,code){return tLWC(ev,code);};function tLL(ev,tLb){tLeB(ev,tLiB(tLMC,tLb),tLRC(tLb));}function tLM(ev,tLb){tLXB(ev);}function tLN(ev,tLb){tLTC(tLRC(tLb));}function tLWC(ev,tLa){tLXC(tLiB(tLLC,tLa));}function tLXC(URL){window.open(URL,'tl_wnd_credentials'+(new Date()).getTime(),tLYC);}var tLB="SCAS";var tLC="SCAS";
var tLD="SC";var tLE="SC";var tLF="SCOP";var tLG="SCOP";var tLH="SCCC";var tLI="SCCC";var tLnC='http://www.trustlogo.com/';if(window.location.protocol.toLowerCase()=="https:"){tLnC='https://secure.comodo.com/';}var tLbC=tLnC+"trustlogo/images/popup/";var tLlC=tLnC+"trustlogo/javascript/tl_tl_popupParent.htm#";var tLyC=tLnC+"trustlogo/logos/";var tLMC=tLnC+'ttb_searcher/trustlogo?';var tLLC=tLMC+"v_querytype=W&";tLMC=tLMC+"v_querytype=C&";var tLNC='&x=6&y=5';
var tLgC=120;
var tLeC = 374;
var tLhC = 660;if (window.attachEvent){var tLhC=660;var tLeC=394;}

var tLP=237;var tLQ=187;

var tLfC=60;var tLiC=160;if(tLu()){tLP=tLP+20;}var tLU=3;var tLV=3;var tLzC="";
var tLR=500;var tLS=500;/*var tLT=7000;*/var tLT=2000;var tLW=100;var tLO=new Array();function tLZC(URL){var i;for(i=0;i<tLO.length;i++){if(tLO[i].src==URL){return;}}var im=new Image();im.src=URL;tLO[tLO.length]=im;}function tLaC(tLPC){tLZC(tLbC+"seal_bg.gif");tLZC(tLbC+"warranty_level.gif");}function tLX(str){return String(str).replace(/\&/g,"&amp;").replace(/\</g,"&lt;").replace(/\>/g,"&gt;").replace(/\'/g,"&#27;").replace(/\"/g,"&#22;");}function tLY(str){return String(str).replace(/\%/g,"%25").replace(/\#/g,"%23")
.replace(/\&/g,"%26").replace(/\?/g,"%3f").replace(/\+/g,"%2b").replace(/\=/g,"%3d").replace(/\ /g,"+").replace(/\%/g,"%25");}if(tLw()){if((screen.availHeight-tLgC)<(tLhC+tLiC)){tLhC=screen.availHeight-tLiC;tLgC=0;}if((screen.availWidth-tLfC)<tLeC){tLeC=screen.availWidth;tLfC=0;}}var tLYC='toolbar=0,scrollbars=1,location=1,status=1,menubar=1,resizable=1,width='+tLeC+',height='+tLhC+',left='+tLfC+',top='+tLgC;function tLiB(tLKC,tLPC){return tLKC+'v_shortname='+tLY(tLPC)+'&v_search='+tLY(window.location.protocol+"//"+host+ escape(window.location.pathname))+tLNC;}function tLQC(tLa){return 'if(window.open(\''+tLX(tLiB(tLLC,tLa))+'\',\'tl_wnd_credentials\'+(new Date()).getTime(),\''+tLYC+'\')){};tLlB(tLTB);';
}function tLRC(tLb){var tLc="tl_popup";if(tLi()&&!tLo()){tLc=tLc+tLb;}else if(tLi()&&tLo()){tLc=tLc+tLb;}else{}return tLc;}function tL1C(s,q,l){var a=s.split(".");if(a.length<2){return "";};var tLZ=tLyC+q+"/"+l+"/"+a[a.length-1];for(var lIndex=a.length-2;lIndex>=0;lIndex--){tLZ=tLZ+"/"+a[lIndex].substr(0,2)+"/"+a[lIndex];}tLZ=tLZ+"/"+s+"."+q+"."+l+".gif";tLZ=tLZ.toLowerCase();return tLZ;}function tL0C(tLZ,tLb){if(!tLZ)return false;if(tLZ==true){tLZ="small";}if(tLZ=="small"||tLZ=="large"){tLZ=tL1C(host,tLb,tLZ);}return tLZ;}function tL9C(e,xy){if(e&&xy){xy[0]=xy[0]+e.offsetLeft;
xy[1]=xy[1]+e.offsetTop;if(e.offsetParent){xy[0]=xy[0]-e.scrollLeft;xy[1]=xy[1]-e.scrollTop;tL9C(e.offsetParent,xy);}}}function tL2C(){var tLhB=tLJB("tL4C");tLhB.style.pixelLeft=0;tLhB.style.pixelTop=0;tLhB.style.display="block";var tL6C=0;var tL7C=0;for(var tL8C=tLhB.offsetParent;tL8C;tL8C=tL8C.offsetParent){tL6C+=tL8C.clientLeft+tL8C.offsetLeft-tL8C.scrollLeft;tL7C+=tL8C.clientTop+tL8C.offsetTop-tL8C.scrollTop;}tL6C-=tL_C().clientLeft-tL_C().scrollLeft;tL7C-=tL_C().clientTop-tL_C().scrollTop;if(tLzC=="topright"){tLhB.style.pixelLeft=tL6C+tL_C().scrollLeft+tL_C().clientWidth-tLhB.offsetWidth;
tLhB.style.pixelTop=tL7C+tL_C().scrollTop;}else if(tLzC=="bottomright"){tLhB.style.pixelLeft=tL6C+tL_C().scrollLeft+tL_C().clientWidth-tLhB.offsetWidth;tLhB.style.pixelTop=tL7C+tL_C().scrollTop+tL_C().clientHeight-tLhB.offsetHeight;}else if(tLzC=="bottomleft"){tLhB.style.pixelLeft=tL6C+tL_C().scrollLeft;tLhB.style.pixelTop=tL7C+tL_C().scrollTop+tL_C().clientHeight-tLhB.offsetHeight;}else if(tLzC=="topleft"){tLhB.style.pixelLeft=tL6C+tL_C().scrollLeft;tLhB.style.pixelTop=tL7C+tL_C().scrollTop;}else{}tLhB.style.display="block";};function tL3C(){window.attachEvent("onscroll",tL2C);window.attachEvent("onresize",tL2C);
window.attachEvent("onreadystatechange",tL2C);window.attachEvent("onload",tL2C);tLIC(tL2C,100);tLIC(tL2C,250);tLIC(tL2C,500);tLIC(tL2C,1000);tLIC(tL2C,2000);tLIC(tL2C,4000);tLIC(tL2C,8000);}function tLUC(tLZ,tLa,tLb,tL5C){if(!tLy()){tL5C=false;}tLZ=tL0C(tLZ,tLb);tLaC(tLb);var tLc=tLRC(tLb);var tLOC=' style="position:absolute;z-index:0;visibility: hidden;background-color: transparent;overflow:hidden;"';if(tLi()&&!tLo()){if(tL5C){tL5C=tL5C.toString().toLowerCase();if((tL5C !="topright")&&(tL5C !="topleft")&&(tL5C !="bottomright")&&(tL5C !="bottomleft")&&(tL5C !="none")){tL5C="topright";}if(tL5C=="none"){
tL5C=false;}tLzC=tL5C;}if(!tLJB(tLc)){if(tLZ){var str="";if(tL5C){str=str+'<div id="tL4C" style="zIndex:0;position:absolute;border:none;padding:0pt;margin:0pt;background-color:transparent;display:none;">'}str=str+'<a href="javascript:'+tLQC(tLa)+'" onmouseover="tLeB(event,\''+tLX(tLiB(tLMC,tLb))+'\',\''+tLc+'\')" onmousemove="tLXB(event)"onmouseout="tLTC(\''+tLc+'\')" ondragstart="return false;"><im'+'g src="'+tLX(tLZ)+'" border=0 onmousedown="return tLKB(event,\''+tLX(tLiB(tLLC,tLa))+'\');" oncontextmenu="return tLLB(event);" /></a><!---->';if(tL5C){str=str+"</div>";tL3C();}document.write(str);
}document.write('<div id="'+tLc+'" name="'+tLc+'" '+tLOC+' onmouseover="tLoB(\''+tLc+'\')" onmousemove="tLpC(\''+tLc+'\')" onmouseout="tLpB(\''+tLc+'\')">&nbsp;</div>');}}else if(tLi()&&tLo()){var tLfB='<iframe src="'+tLX(tLiB(tLMC,tLb))+'" id="'+tLc+'tLDD" name="'+tLc+'tLDD" width="'+tLP+'" height="'+tLQ+'" frameborder="0" allowtransparency="true" style="background:transparent;width:'+tLP+';height:'+tLQ+'"></iframe>';if(!tLJB(tLc)){document.write('<div id="'+tLc+'" name="'+tLc+'" '+tLOC+' onmouseover="tLoB(\''+tLc+'\')" onmousemove="tLpC(\''+tLc+'\')" onmouseout="tLpB(\''+tLc+'\')">'+tLfB+'</div>');
}if(tLZ){document.write('<a href="javascript:'+tLQC(tLa)+'" onmouseover="tLeB(event,\''+tLX(tLiB(tLMC,tLb))+'\',\''+tLc+'\')" onmousemove="tLXB(event)" onmouseout="tLTC(\''+tLc+'\')" ondragstart="return false;"><im'+'g src="'+tLX(tLZ)+'" border=0 onmousedown="return tLKB(event,\''+tLX(tLiB(tLLC,tLa))+'\');" oncontextmenu="return tLLB(event);" /></a>');}}else{if(tLZ){document.write('<a href="javascript:'+tLQC(tLa)+'" title="Click to verify" onmouseover="if(window.status=\'Click to verify\'){}"><im'+'g src="'+tLX(tLZ)+'" border=0 oncontextmenu="return tLLB(event);" title="Click to verify" onmouseover="if(window.status=\'Click to verify\'){}"'
+'/></a><!---->');}}}function tLrC(left1,top1,width1,height1,left2,top2,width2,height2){if(left1+width1<left2)return false;if(top1+height1<top2)return false;if(left2+width2<left1)return false;if(top2+height2<top1)return false;return true;}function tLsC(sty){if(sty.display=="none")return false;if(sty.visibility=="hidden")return false;if(sty.visibility=="visible")return true;return true;}function tLtC(e){if(!tLsC(e.currentStyle))return false;while(e.currentStyle.visibility=="inherit"){e=e.parentElement;if(!e)return true;if(!tLsC(e.currentStyle))return false;}return true;}function tLuC(left,top,width,height,e,tLCD){
if(!tLCD){if(!tLtC(e))return false;}var tLBD=e.offsetLeft;var tLAD=e.offsetTop;for(var tL8C=e.offsetParent;tL8C;tL8C=tL8C.offsetParent){tLBD+=tL8C.clientLeft+tL8C.offsetLeft-tL8C.scrollLeft;tLAD+=tL8C.clientTop+tL8C.offsetTop-tL8C.scrollTop;}tLBD-=tL_C().clientLeft-tL_C().scrollLeft;tLAD-=tL_C().clientTop-tL_C().scrollTop;return tLrC(left,top,width,height,tLBD,tLAD,e.offsetWidth,e.offsetHeight);}function tLvC(left,top,width,height,coll,tLCD){for(var lIndex=0;lIndex<coll.length;lIndex++){if(tLuC(left,top,width,height,coll[lIndex],tLCD)){return true;}}return false;}function tLjC(){if(tLx()){if(false
||tL_C().clientWidth<tLP-10||tL_C().clientHeight<tLQ-10||tLvC(tLOB,tLPB,tLP,tLQ,document.getElementsByTagName("object"))||tLvC(tLOB,tLPB,tLP,tLQ,document.getElementsByTagName("embed"))||tLvC(tLOB,tLPB,tLP,tLQ,document.getElementsByTagName("applet"))||tLvC(tLOB,tLPB,tLP,tLQ,document.getElementsByTagName("select")))return true;return false;}return false;}function tLz(){if((tLi())&&!tLv()){return true;}return false;}var tLGB;function tLHB(){if(tLGB){return tLGB;};var tLFB="UNSUPPORTED:tL_B::";var tL1=tLFB;var tL2=tLFB;var tL3="MSIE5:tLtB:tLvB:tLyB:tLwB:tL3B:tL7B:tL5B:tLAC:tLBC::";var tL4="MSIE5_5:tLtB:tLvB:tLyB:tLxB:tLwB:tL3B:tL7B:tL5B:tLAC:tLBC:tLCC:tLDC::";
var tL5=tL4;var tL6=tL5;var tL7="MACIE5_1:tLtB:tLvB:tLyB:tLzB:tLwB:tL3B:tL7B:tL5B:tLAC:tLBC::";var tL8=tLFB;var tL9="OPERA6:tLvB:tL4B:tLxB:tLwB:tLyB:tL3B:tL7B:tL6B:tLsB::";var tL_=tLFB;var tLAB="NS6:tLvB:tLwB:tLyB:tL2B:tL8B:tL6B::";var tLBB=tLAB;var tLCB=tLFB;var tLDB="UP:tLtB:tLyB:tLwB:tL7B::";var tLEB="UPUP:tLtB:tLvB:tLyB:tLxB:tLwB:tL3B:tL7B:tL5B:tLAC:tLBC:tLCC:tLDC::";var tLEC=navigator.userAgent;var tLFC=navigator.appVersion;tLGB=tLFB;var tLGC=0;if(document.getElementById){tLGB=tLEB;tLGC=tLEC.indexOf("Opera ");if(tLGC !=-1){var tLjB=parseFloat(tLEC.substring(tLGC+6,tLGC+10));if(tLjB<5){tLGB=tLCB;}else if(tLjB<=5.999){
tLGB=tL8;}else if(tLjB<7){tLGB=tL9;}else{tLGB=tLEB;}}else if(navigator.appName=="Microsoft Internet Explorer"){tLGC=tLFC.indexOf("MSIE ");var tLjB=parseFloat(tLFC.substring(tLGC+5,tLGC+9));if(navigator.platform=="MacPPC"||navigator.platform=="Mac68K"){tLGB=tL7}else{tLGB=tLEB;if(tLjB<=3.5){tLGB=tL1;}else if(tLjB<=4.5){tLGB=tL2;}else if(tLjB<5.49){tLGB=tL3;}else if(tLjB<6){tLGB=tL4;}else if(tLjB<6.5){tLGB=tL5;}else{tLGB=tL6;}}}else if(navigator.appName=="Netscape"){var tLjB=parseFloat(tLFC);if(tLjB<4.7){tLGB=tLFB;}else if(tLjB<4.8){tLGB=tL_}else{tLGB=tLAB;}}else{tLGB=tLEB;}}else if(document.all){
if(navigator.appName=="Microsoft Internet Explorer"){tLGC=tLFC.indexOf("MSIE ");var tLjB=parseFloat(tLFC.substring(tLGC+5,tLGC+9));if(navigator.platform=="MacPPC"||navigator.platform=="Mac68K"){tLGB=tL7}else{tLGB=tLEB;if(tLjB<=3.5){tLGB=tL1;}else if(tLjB<=4.5){tLGB=tL2;}else if(tLjB<5.49){tLGB=tL3;}else if(tLjB<6){tLGB=tL4;}else if(tLjB<6.5){tLGB=tL5;}else{tLGB=tL6;}}}else{tLGB=tLDB;}}else if(document.layers){if(navigator.appName=="Netscape"){var tLjB=parseFloat(tLFC);if(tLjB<4.7){tLGB=tLCB;}else if(tLjB<4.8){tLGB=tL_;}else{tLGB=tLAB;}}else{tLGB=tLCB;}}else{tLGB=tLFB;}return tLGB;}function tLIB(feat){
var tLkB=tLHB();feat=":"+feat+":";if(tLkB.indexOf(feat)==-1){return false;}return true;}function tLd(){return tLIB("tLtB");};function tLe(){return tLIB("tLuB");};function tLf(){return tLIB("tLvB");};function tLh(){return tLIB("tLxB");};function tLi(){return tLIB("tLyB");};function tLj(){return tLIB("tLzB");};function tLl(){return tLIB("tL1B");};function tLm(){return tLIB("tL2B");};function tLn(){return tLIB("tL3B");};function tLo(){return tLIB("tL4B");};function tLp(){return tLIB("tL5B");};function tLq(){return tLIB("tL6B");};function tLr(){return tLIB("tL7B");};function tLs(){return tLIB("tL8B");};
function tLt(){return tLIB("tLAC");};function tLu(){return tLIB("tLsB");};function tLx(){return tLIB("tLCC");};function tLv(){return tLIB("tL_B");};function tLw(){return tLIB("tLBC");};function tLy(){return tLIB("tLDC");};function tLJB(id){if(tLf()){return document.getElementById(id);}else if(tLd()){return document.all[id];}else if(tLe()){return document.layers[id];}else{return null;}}function tLHC(id){window.clearTimeout(id);}function tLIC(str,del){return window.setTimeout(str,del);}function tLKB(ev,URL){if(!tLz())return true;if(ev.button&2){alert("This TrustLogo is protected");if(tLp()){ev.cancelBubble=true;
ev.returnValue=false;}else if(tLq()){ev.preventDefault();ev.cancelPropagation();}return false;}if(ev.button&1){return true;window.open(URL,'tl_wnd_credentials'+(new Date()).getTime(),tLYC);if(tLp()){ev.cancelBubble=true;ev.returnValue=false;}else if(tLq()){ev.preventDefault();ev.cancelPropagation();}return false;}}function tLLB(ev){if(!tLz())return;if(tLp()){ev.cancelBubble=true;ev.returnValue=false;}else if(tLq()){ev.preventDefault();ev.cancelPropagation();}return false;}function tLMB(){if(!tLz())return;tLQB=0;tLnB(tLNB,tLOB,tLPB,tLTB);}var tLNB="";var tLOB=0;var tLPB=0;var tLQB=0;var tLRB=0;var tLSB=null;
var tLTB="";var tLUB=false;var tLVB=0;var tLWB="";function tL_C(){if(document.compatMode=="CSS1Compat"){return document.body.parentElement;}else{return document.body;}}function tLXB(ev){if(!tLz())return;if(tLWB)return;var tLYB;var tLZB;var tLaB=0;var tLbB=0;var tLcB=800;var tLdB=600;if(tLn()){tLaB=tL_C().scrollLeft;tLbB=tL_C().scrollTop;tLcB=tL_C().clientWidth;tLdB=tL_C().clientHeight;tLYB=ev.clientX+tLaB;tLZB=ev.clientY+tLbB;}else if(tLm()){tLYB=ev.pageX;tLZB=ev.pageY;tLaB=window.pageXOffset;tLbB=window.pageYOffset;tLcB=window.innerWidth;tLdB=window.innerHeight;}if(tLaB+tLcB>=tLYB+tLP){tLOB=tLYB+tLU;
}else if(tLaB<=tLYB-tLP){tLOB=tLYB-tLP-tLU;}else{tLOB=tLaB+tLcB/2-tLP/2;}if(tLbB+tLdB>=tLZB+tLQ){tLPB=tLZB+tLV;}else if(tLbB<=tLZB-tLQ){tLPB=tLZB-tLQ-tLV;}else{tLPB=tLbB+tLdB/2-tLQ/2;}return true;}function tLeB(ev,tLSC,tLc){if(!tLz())return;  if (current_code == "CL1" || current_code == "SC5"  || current_code == "SC4") { tLP = 356;  tLQ =259; }var tLVC='src="'+tLX(tLSC)+'" id="'+tLc+'tLDD" name="'+tLc+'tLDD" width="'+tLP+'" height="'+tLQ+'"';var tLkC='src="'+tLlC+tLX(tLY(tLSC))+'" id="'+tLc+'tLDD" name="'+tLc+'tLDD" width="'+tLP+'" height="'+tLQ+'"';var tLfB='<iframe '+tLVC+' frameborder="0" allowtransparency="true" style="background:transparent;overflow:hidden;"></iframe>';var tLmC='<iframe '+tLkC+' frameborder="0" allowtransparency="true" style="background:transparent;overflow:hidden;" '
+'ondeactivate="tLIC(\'tLlB(\\\''+tLc+'\\\');\',1);"></iframe>';var tLgB='<layer width='+tLP+' height='+tLQ+'><layer '+tLVC+' style="position:relative;background:transparent;" onmouseover="tLoB(\''+tLc+'\')" onmouseout="tLpB(\''+tLc+'\')"></layer></layer>';if(tLjC()){tLNB=tLmC;}else if(tLi()){tLNB=tLfB;}else{return;}if(tLTB&&(tLc !=tLTB)){tLlB(tLTB);tLlB(tLc);tLmB();}if(tLUB)return;var tLhB;if(tLi()){tLhB=tLJB(tLc);if(tLhB.style.visibility=="visible"){if(tLNB !=tLWB){if(tLRB){tLHC(tLRB);tLRB=0;}tLlB(tLc);tLWB=tLNB;}else{if(tLRB){tLHC(tLRB);tLRB=0;}return;}}}tLXB(ev);tLTB=tLc;if(!tLQB){tLQB=tLIC("tLMB()",tLR);
if(tLRB){tLHC(tLRB);tLRB=0;}}}function tLnB(tLoC,x,y,tLc){if(!tLz())return;if(tLoC !=tLWB){if(tLRB){tLHC(tLRB);tLRB=0;}tLlB(tLc);}tLWB=tLoC;if(!tLz())return;var tLhB;if(tLi()){tLhB=tLJB(tLc);tLhB.style.visibility="visible";if(tLhB&&tLhB.offsetParent){var xy=new Array(-x,-y);tL9C(tLhB.offsetParent,xy);x=-xy[0];y=-xy[1];}if(tLr()){tLhB.style.pixelLeft=x;if(!tLj()){tLhB.style.pixelTop=y;}tLhB.style.pixelWidth=tLP;tLhB.style.pixelHeight=tLQ;}else{tLhB.style.left=x+"px";if(!tLj()){tLhB.style.top=y+"px";}tLhB.style.width=tLP+"px";tLhB.style.height=tLQ+"px";}tLhB.style.borderWidth='0px';if(!tLo()){tLhB.innerHTML=tLoC;
}if(tLjC()){var tLqB=tLJB(tLc+'tLDD');}tLhB.style.zIndex=0;tLhB.style.visibility="visible";}}function tLqC(){return !tLh()||tLjC();}function tLTC(tLc){if(!tLz())return;if(tLQB){tLHC(tLQB);tLQB=0;}if(tLqC()){if(!tLRB){tLRB=tLIC('tLlB("'+tLc+'")',tLT);}}else{if(!tLRB){tLRB=tLIC('tLlB("'+tLc+'")',tLS);}}}function tLpC(tLc){if(!tLz())return;if(tLRB){tLHC(tLRB);tLRB=0;}if(tLqC()&&tLRB==0){tLRB=tLIC('tLlB("'+tLc+'")',tLT);}}function tLoB(tLc){if(!tLz())return;if(tLRB){tLHC(tLRB);tLRB=0;}if(tLqC()&&tLRB==0){tLRB=tLIC('tLlB("'+tLc+'")',tLT);}}function tLpB(tLc){if(!tLz())return;if(tLqC()){if(!tLRB){tLRB=tLIC('tLlB("'+tLc+'")',tLT);
}}else{if(!tLRB){tLRB=tLIC('tLlB("'+tLc+'")',tLS);}}}function tLlB(tLc){if(!tLz())return;if(tLRB){tLRB=0;}if(tLQB&&tLTB==tLc){tLHC(tLQB);tLQB=0;}tLWB="";var tLhB;if(tLi()){tLhB=tLJB(tLc);}if(!tLz())return;if(null==tLhB){}else if(tLi()){tLhB.style.visibility="hidden";tLhB.innerHTML="";}else{tLhB.visibility="hide";}if(!tLVB){tLUB=true;tLVB=tLIC("tLmB()",tLW);}}function tLmB(){if(tLVB){tLVB=0;tLUB=false;}}
function createStyleRule(selector, declaration) {if (!document.getElementsByTagName ||!(document.createElement || document.createElementNS)) return;var agt = navigator.userAgent.toLowerCase();var is_ie=((agt.indexOf("msie")!=-1)&&(agt.indexOf("opera") == -1));var is_iewin=(is_ie&&(agt.indexOf("win")!=-1));var is_iemac=(is_ie&&(agt.indexOf("mac")!=-1));if (is_iemac) return;var head = document.getElementsByTagName("head")[0];var style=(typeof document.createElementNS!="undefined")?document.createElementNS("http://www.w3.org/1999/xhtml", "style"):document.createElement("style");
if (!is_iewin) {var styleRule = document.createTextNode(selector + " {" + declaration + "}");style.appendChild(styleRule);}style.setAttribute("type", "text/css");style.setAttribute("media", "screen"); head.appendChild(style);if (is_iewin&&document.styleSheets&&document.styleSheets.length>0){var lastStyle = document.styleSheets[document.styleSheets.length - 1];if (typeof lastStyle.addRule == "object"){lastStyle.addRule(selector, declaration);}}}
version=0;if (navigator.appVersion.indexOf("MSIE")!=-1){temp=navigator.appVersion.split("MSIE");version=parseFloat(temp[1]);}
if (version>=5.5 && (window.createPopup) && (!(document.documentElement && typeof document.documentElement.style.maxHeight!="undefined"))){document.writeln('<style type="text/css">#comodoTL{display:none;font-size:8px;padding-left:18px;}</style>');}
else {if(version=="9")
	{
		document.writeln('<style type="text/css">#comodoTL{display:block;font-size:8px;padding-left:18px;}</style>');
	}
	else
	{
    createStyleRule("#comodoTL", "display:block;font-size:8px;padding-left:18px;");
	}}