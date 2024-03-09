import { PersonOutline, SavingsOutlined, VolumeUpOutlined, ArrowRightOutlined, Close, AttachFile, Mail, PieChart, ArrowCircleRightOutlined, MonetizationOnOutlined, LocationOnOutlined, AccessTimeOutlined, ArrowRight, CalendarMonthOutlined } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import useWindowDimensions from "../../../../helper/dimension";
import { myEles, setTitle, appName, Mgin, LrText, BtnIcn, icony, IconBtn, Btn, ErrorCont, Line, paystackPK, getPayRef } from "../../../../helper/general";
import { annEle, defVal, dioceseBasicinfo, dioceseGeneralinfo, dioceseSecretaryInfo, eventEle, eventRegEle, payRecordEle } from "../../../classes/models";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Toast from "../../../toast/toast";
import { getDioceseId, makeRequest, resHandler } from "../../../../helper/requesthandler";
import { PoweredBySSS, getGreeting } from "../../../../helper/nacdded";
import tabcard from "../../../../assets/tabcard.png"




export function Events(mainprop:{msi:dioceseSecretaryInfo,mbi:dioceseBasicinfo,mgi?:dioceseGeneralinfo}){
    const location = useLocation()
    const navigate = useNavigate()
    const mye = new myEles(false);
    const myKey = Date.now()
    const dimen = useWindowDimensions();
    const[events,setEvents] = useState<eventEle[]>([])
    const[myRegs,setMyRegs] = useState<eventRegEle[]>([])
    const[tabPos, setTabPos] = useState(0)


    useEffect(()=>{
        setTitle(`Events and Conferences - ${appName}`)
        getEvents(0)
        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
          };
    },[])

    


    function handleError(task:resHandler){
        setLoad(false)
        setError(true)
        if(task.isLoggedOut()){
            navigate(`/login?rdr=${location.pathname.substring(1)}`)
        }else{
            toast(task.getErrorMsg(),0)
        }
    }

    function getEvents(tabPos:number){
        setTabPos(tabPos)
        setError(false)
        setLoad(true)
        const currentDate = new Date();
        
        if(tabPos == 0){
            const fromDate = new Date(currentDate);
            const toDate = new Date(currentDate);
            toDate.setFullYear(currentDate.getFullYear() + 10);
            makeRequest.get('getEvents',{
                from: fromDate.getTime(),
                to: toDate.getTime()
            },(task)=>{
                setLoad(false)
                if(task.isSuccessful()){
                    const tem:eventEle[] = []
                    for(const key in task.getData()){
                        tem.push(new eventEle(task.getData()[key]))
                    }
                    setEvents(tem)
                }else{
                    handleError(task)
                }
            })
        }

        if(tabPos == 1){
            makeRequest.get(`getDioceseEventRegs/${getDioceseId()}`,{
                start:0,
                count:20
            },(task)=>{
                setLoad(false)
                if(task.isSuccessful()){
                    const tem:eventRegEle[] = []
                    for(const key in task.getData()){
                        tem.push(new eventRegEle(task.getData()[key]))
                    }
                    setMyRegs(tem)
                }else{
                    handleError(task)
                }
            })
        }

        if(tabPos == 2){
            const fromDate = new Date(currentDate);
            fromDate.setFullYear(currentDate.getFullYear() - 10);
            const toDate = new Date(currentDate);
            makeRequest.get('getEvents',{
                from: fromDate.getTime(),
                to: toDate.getTime()
            },(task)=>{
                setLoad(false)
                if(task.isSuccessful()){
                    const tem:eventEle[] = []
                    for(const key in task.getData()){
                        tem.push(new eventEle(task.getData()[key]))
                    }
                    setEvents(tem)
                }else{
                    handleError(task)
                }
            })
        }

    }


    const[load, setLoad]=useState(false)
    const[loadMsg, setLoadMsg]=useState('Just a sec')
    const[error, setError]=useState(false)
    const[toastMeta, setToastMeta] = useState({visible: false,msg: "",action:2,invoked:0})
    const[timy, setTimy] = useState<{timer?:NodeJS.Timeout}>({timer:undefined});
    function toast(msg:string, action:number,delay?:number){
      var _delay = delay || 5000
      setToastMeta({
          action: action,
          msg: msg,
          visible:true,
          invoked: Date.now()
      })
      clearTimeout(timy.timer)
      setTimy({
          timer:setTimeout(()=>{
              if(Date.now()-toastMeta.invoked > 4000){
                  setToastMeta({
                      action:2,
                      msg:"",
                      visible:false,
                      invoked: 0
                  })
              }
          },_delay)
      });
    }


    return <div style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?40:20
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
            getEvents(0)
        }}/>
        <div className="prgcont" style={{display:load?"flex":"none"}}>
            <div className="hlc" style={{
                backgroundColor:mye.mycol.bkg,
                borderRadius:10,
                padding:20,
            }}>
                <CircularProgress style={{color:mye.mycol.primarycol}}/>
                <Mgin right={20} />
                <mye.Tv text={loadMsg} />
            </div>
        </div>
        <Toast isNgt={false} msg= {toastMeta.msg} action={toastMeta.action} visible={toastMeta.visible} canc={()=>{
                setToastMeta({
                    action:2,
                    msg:"",
                    visible:false,
                    invoked:0,
                })
            }} />
        <Mgin top={20} />
        <div style={{
            width:500,
            display:'flex'
        }}>
            <div style={{
                flex:1
            }}>
                <Btn txt="Upcoming Events" round onClick={()=>{
                    getEvents(0)
                }} transparent={tabPos!=0} width={150}/>
            </div>
            <Mgin right={10} />
            <div style={{
                flex:1
            }}>
                <Btn txt="Registered Events" round onClick={()=>{
                    getEvents(1)
                }} transparent={tabPos!=1} width={150} />
            </div>
            <Mgin right={10} />
            <div style={{
                flex:1
            }}>
                <Btn txt="Past Events" round onClick={()=>{
                    getEvents(2)
                }} transparent={tabPos!=2} width={150}/>
            </div>
        </div>
        <Mgin top={40} />
        <div style={{
            width:'100%',
            display:'flex',
            flexWrap:'wrap'
        }}>
            {
                tabPos!=1?events.map((ev,i)=>{
                    return <EventMini key={myKey+i+0.23}  ele={ev} mbi={mainprop.mbi}/>
                }):myRegs.map((rg,i)=>{
                    return <EventMini key={myKey+i+0.24}  reg={rg} mbi={mainprop.mbi}/>
                })
            }
        </div>
        <PoweredBySSS />
    </div>

}


function EventMini(prop:{ele?:eventEle,reg?:eventRegEle,mbi:dioceseBasicinfo}) {
    const location = useLocation()
    const navigate = useNavigate()
    const mye = new myEles(false)
    const dimen = useWindowDimensions()
    const[event,setEvent] = useState(new eventEle(null))
    const[amReg, setAmReg] = useState(prop.reg!=undefined)
    const[showOffline, setShowOffline] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
        begin()
    },[])

    function handleError(task:resHandler){
        setLoad(false)
        setError(true)
        if(task.isLoggedOut()){
            navigate(`/login?rdr=${location.pathname.substring(1)}`)
        }else{
            toast(task.getErrorMsg(),0)
        }
    }

    function begin(){
        setShowOffline(false)
        if(prop.ele){
            setEvent(prop.ele)
            //Check if am reg
            makeRequest.get(`hasDioceseRegisteredEvent/${getDioceseId()}/${prop.ele.getEventId()}`,{},(task)=>{
                if(task.isSuccessful()){
                    setAmReg(task.getData()['exists']=='1')
                }
            })
        }else{
            setEvent(prop.reg!.event)
            prop.reg!.registerRecall(()=>{
                setEvent(prop.reg!.event)
            })
        }
    }

    const[load, setLoad]=useState(false)
    const[loadMsg, setLoadMsg]=useState('Just a sec')
    const[error, setError]=useState(false)
    const[toastMeta, setToastMeta] = useState({visible: false,msg: "",action:2,invoked:0})
    const[timy, setTimy] = useState<{timer?:NodeJS.Timeout}>({timer:undefined});
    function toast(msg:string, action:number,delay?:number){
    var _delay = delay || 5000
    setToastMeta({
        action: action,
        msg: msg,
        visible:true,
        invoked: Date.now()
    })
    clearTimeout(timy.timer)
    setTimy({
        timer:setTimeout(()=>{
            if(Date.now()-toastMeta.invoked > 4000){
                setToastMeta({
                    action:2,
                    msg:"",
                    visible:false,
                    invoked: 0
                })
            }
        },_delay)
    });
    }

    return <div style={{
        backgroundColor: mye.mycol.white,
        borderRadius:10,
        boxSizing:'border-box',
        padding:10,
        width: dimen.dsk?400:'100%',
        margin:10
    }}>
        <ErrorCont isNgt={false} visible={error} retry={()=>{
            setError(false)
        }}/>
        <div className="prgcont" style={{display:load?"flex":"none"}}>
            <div className="hlc" style={{
                backgroundColor:mye.mycol.bkg,
                borderRadius:10,
                padding:20,
            }}>
                <CircularProgress style={{color:mye.mycol.primarycol}}/>
                <Mgin right={20} />
                <mye.Tv text={loadMsg} />
            </div>
        </div>
        <Toast isNgt={false} msg= {toastMeta.msg} action={toastMeta.action} visible={toastMeta.visible} canc={()=>{
                setToastMeta({
                    action:2,
                    msg:"",
                    visible:false,
                    invoked:0,
                })
            }} />
        <LrText
        left={<div className="hlc">
            <CalendarMonthOutlined style={{
                fontSize:15, 
                color: mye.mycol.primarycol
            }} />
            <Mgin right={3} />
            <mye.Tv text={event.getDate()} size={14} color={mye.mycol.primarycol} />
        </div>}
        right={<div className="hlc">
            {
                prop.reg?<div style={{
                    padding:'2px 5px',
                    borderRadius:3,
                    backgroundColor: prop.reg.isVerified()?mye.mycol.greenstrip:mye.mycol.bluestrip
                }}>
                    <mye.Tv text={prop.reg.isVerified()?'VERIFIED':`UNVERIFIED`} color={prop.reg.isVerified()?mye.mycol.green:mye.mycol.hs_blue}/>
                </div>:<div></div>
            }
            <Mgin right={3}/>
                <div style={{
                padding:'2px 5px',
                borderRadius:3,
                backgroundColor: event.isFree()?mye.mycol.btnstrip:mye.mycol.bluestrip
            }}>
                <mye.Tv text={event.isFree()?'Free':`N${event.getFee()}`} color={event.isFree()?mye.mycol.primarycol:mye.mycol.hs_blue}/>
            </div>
        </div>}
        />
        <Mgin top={20} />
        <mye.BTv text={event.getTitle()} size={16} color={mye.mycol.secondarycol} />
        <Mgin top={15} />
        <mye.Tv text={event.getTheme()}  />
        <Mgin top={10} />
        <LrText 
        left={<Btn width={120} txt={amReg?'REGISTERED':'REGISTER'} onClick={()=>{
            if(event.data==null){
                toast('Please refresh page',2)
                return;
            }
            if(amReg){
                toast('Already Registered',1)
            }else{
                setLoad(true)
                //Confirm if im registered
                makeRequest.get(`hasDioceseRegisteredEvent/${getDioceseId()}/${event.getEventId()}`,{},(task)=>{
                    if(task.isSuccessful()){
                        if(task.getData()['exists']!='1'){
                            if(event.isFree()){
                                makeRequest.get(`getFreeEvent/${getDioceseId()}/${event.getEventId()}`,{},(task)=>{
                                    setLoad(false)
                                    if(task.isSuccessful()){
                                        toast('Registered successfully',1)
                                        begin()
                                    }else{
                                        handleError(task)
                                    }
                                })
                            }else{
                                setLoad(false)
                                setShowOffline(true)
                            }
                        }else{
                            setLoad(false)
                            toast('Already Registered',1)
                        }
                    }else{
                        handleError(task)
                    }
                })
            }
        }} />}
        right={<Btn width={120} txt="DETAILS"  outlined onClick={()=>{

        }}/>}
        />
        {showOffline?<div style={{
            width:'100%'
        }}>
            <Mgin top={10} />
            <mye.BTv text="If you have already paid" size={16} />
            <Mgin top={5} />
            <mye.Tv text="If you have already paid outside of this portal, please upload your receipt. If not, click PAY NOW" />
            <Mgin top={10} />
            <Btn txt="PAY NOW" onClick={()=>{
                setLoad(true)
                payWithPaystack(event)
            }} />
            <Mgin top={10} />
            <input
                type="file"
                accept="image/*"
                onChange={(e)=>{
                    const file = e.target.files?.[0];
                    if(file){
                        setLoad(true)
                        makeRequest.uploadFile('receipts',event.getEventId()+'_'+getDioceseId(),getDioceseId(),file, (task)=>{
                            if(task.isSuccessful()){
                                makeRequest.get(`manualRegEvent/${getDioceseId()}/${event.getEventId()}`,{},(task)=>{
                                    setLoad(false)
                                    if(task.isSuccessful()){
                                        toast('Registered successfully',1)
                                        begin()
                                    }else{
                                        handleError(task)
                                    }
                                })
                            }else{
                                setLoad(false)
                                if(task.isLoggedOut()){
                                    navigate('/login')
                                    return
                                }
                                toast(task.getErrorMsg(),0)
                            }
                        })
                    }else{
                        toast('Invalid File. Try again',0)
                    }
                }}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
            <Btn txt="UPLOAD RECEIPT" onClick={()=>{
                fileInputRef.current?.click()
            }} strip/>
        </div>:<div></div>}
    </div>

    function payWithPaystack(ev:eventEle) {
        if((window as any).PaystackPop){
            var handler = (window as any).PaystackPop.setup({

                subaccount: "ACCT_h7vjxjpgaozww2z",
        
                key: paystackPK,
            
                email: prop.mbi.getPhone()+'@nacdded.org.ng',
            
                amount: parseFloat(ev.getFee()) * 100, //In kobo

                label: 'NACDDED PAYMENTS',
            
                currency: 'NGN', 
            
                ref: getPayRef('1',ev.getFee(),getDioceseId()), 
            
                callback: function(response:any) {
                    //var reference = response.reference;
                    toast('Payment processing...',1);
                    setLoad(false)
                },
            
                onClose: function() {
                    setLoad(false)
                    toast('Transaction cancelled',0);
                },
                metadata: {
                    name: prop.mbi.getName(),
                    time: Date.now().toString(),
                    year: '', 
                    event: ev.getEventId() 
                    },
                });
                handler.openIframe();
        }else{
            toast('An error occured. Please refresh the page',0)
        }
    }
    
}

