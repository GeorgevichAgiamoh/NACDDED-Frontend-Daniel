import { PersonOutline, SavingsOutlined, VolumeUpOutlined, ArrowRightOutlined, Close, AttachFile, Mail, PieChart, ArrowCircleRightOutlined, MonetizationOnOutlined, LocationOnOutlined, AccessTimeOutlined, ArrowRight, CalendarMonthOutlined, Add, ArrowBack, ArrowForward, MoreVert } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import useWindowDimensions from "../../../../helper/dimension";
import { myEles, setTitle, appName, Mgin, LrText, BtnIcn, icony, IconBtn, Btn, ErrorCont, Line, paystackPK, getPayRef, EditTextFilled, DatePicky, spin_pricing } from "../../../../helper/general";
import { annEle, defVal, dioceseBasicinfo, dioceseGeneralinfo, dioceseSecretaryInfo, eventEle, eventRegEle, eventStat, payRecordEle } from "../../../classes/models";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import Toast from "../../../toast/toast";
import { getDioceseId, makeRequest, resHandler } from "../../../../helper/requesthandler";
import { PoweredBySSS, getGreeting } from "../../../../helper/nacdded";
import tabcard from "../../../../assets/tabcard.png"
import { addSeconds, format } from "date-fns";
import TimePicker from "react-time-picker";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';




export function AdminWorkFlowList(mainprop:{actiony:(action:number,ev?:eventEle)=>void}){
    const location = useLocation()
    const navigate = useNavigate()
    const mye = new myEles(false);
    const myKey = Date.now()
    const dimen = useWindowDimensions();
    const[optToShow,setOptToShow] = useState(-1)
    const[showingIndex,setShowingIndex] = useState(0)
    const[evs,setEvs] = useState<eventEle[]>([])
    const[eStat, setEStat] = useState<eventStat>()


    useEffect(()=>{
        setTitle(`Admin Workflow - ${appName}`)
        getEventStats()
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

    function getEventStats(dontGetThem?:boolean){
        setLoad(true)
        setError(false)
        makeRequest.get('getEventStat',{},(task)=>{
            if(task.isSuccessful()){
                setEStat(new eventStat(task.getData()))
                if(dontGetThem){
                    setLoad(false)
                }else{
                    getTheEvents(0)
                }
            }else{
                handleError(task)
            }
        })
    }

    function getTheEvents(index:number){
        setOptToShow(-1)
        setError(false)
        setLoad(true)
        const currentDate = new Date();
        const futureDate = new Date(currentDate);
        futureDate.setFullYear(currentDate.getFullYear() + 10); // 10 years
        makeRequest.get(`getEvents`,{
            start:(index*20),
            count:20,
            from: 0,
            to: futureDate.getTime()
        },(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                const tem:eventEle[] = []
                for(const key in task.getData()){
                    tem.push(new eventEle(task.getData()[key]))
                }
                setEvs(tem)
                setShowingIndex(index)
            }else{
                handleError(task)
            }
        })
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
            getEventStats()
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
        <div className="vlc" id="lshdw" style={{
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            padding:dimen.dsk?40:20,
            boxSizing:'border-box',
            width:'100%'
        }}>
            <LrText 
                left={<div className="hlc">
                <CalendarMonthOutlined style={{
                    fontSize:25,
                    color: mye.mycol.secondarycol
                }} />
                <Mgin right={10} />
                <mye.BTv text="Events" size={20} color={mye.mycol.secondarycol} />
            </div>}
            right={<Btn txt="NEW EVENT" width={120} onClick={()=>{
                mainprop.actiony(1)
            }} />}
            />
            <Mgin top={20} />
            {evs.length==0?<div className="ctr" style={{
                width:'100%',
                height:300
            }}>
                <mye.BTv text="No Event Created. Click On New Event To Get Started" size={20} />
            </div>:<div className="hlc" style={{
                width:dimen.dsk2?'100%':dimen.dsk?dimen.width-450:dimen.width-60,
                overflowX:'scroll'
            }}>
                <div style={{
                    width:dimen.dsk2?'100%':undefined,
                    paddingBottom:optToShow!=-1?200:0,
                }}>
                    <div className="hlc">
                        <MyCell text="Event Title"  isBold/>
                        <MyCell text="Event Date"  isBold/>
                        <MyCell text="Venue"  isBold/>
                        <MyCell text="Action"  isBold/>
                    </div>
                    {
                        evs.map((ele,index)=>{
                            return <div className="hlc" key={myKey+index+showingIndex*20}>
                                <MyCell text={ele.getTitle()} />
                                <MyCell text={ele.getDate()} />
                                <MyCell text={ele.getVenue()} />
                                <Opts index={index} evt={ele} rmvMe={()=>{
                                    const i = index+showingIndex*20
                                    const al = [...evs.slice(0, i), ...evs.slice(i + 1)]
                                    setEvs(al)
                                    getEventStats(true)
                                }} />
                            </div>
                        })
                    }
                </div>
            </div>}
            <Mgin top={20} />
            <div className="hlc">
                <ArrowBack id="clk" className="icon" onClick={()=>{
                    if(showingIndex >0){
                        const index = showingIndex-1
                        getTheEvents(index)
                    }
                }} />
                <Mgin right={10} />
                {
                    Array.from({length:Math.floor((eStat?eStat.totalEvents():0)/20)+1},(_,index)=>{
                        return <div id="clk" key={myKey+index+10000} className="ctr" style={{
                            width:25,
                            height:25,
                            backgroundColor:showingIndex==index?mye.mycol.black:'transparent',
                            borderRadius:'50%'
                        }} onClick={()=>{
                            getTheEvents(index)
                        }}>
                            <mye.BTv text={(index+1).toString()} color={showingIndex==index?mye.mycol.white:mye.mycol.black} size={16}/>
                        </div>
                    })
                }
                <Mgin right={10} />
                <ArrowForward id="clk" className="icon" onClick={()=>{
                    const len = Math.floor((eStat?eStat.totalEvents():0)/20)
                    if(showingIndex < len){
                        const index = showingIndex+1
                        getTheEvents(index)
                    }
                }} />
            </div>
        </div>
        <Mgin top={20} />
        <PoweredBySSS />
    </div>

    function MyCell(prop:{text:string,isBold?:boolean,alignStart?:boolean,ocl?:()=>void, special?:boolean}) {
        return <div id={prop.special?'clk':undefined} className="ctr" style={{
            flex:(dimen.dsk2 && !prop.special)?1:undefined,
            width:(dimen.dsk2 && !prop.special)?undefined:100,
            height:40,
            padding:prop.alignStart?'0px 10px':undefined,
            boxSizing:'border-box',
            alignItems: prop.alignStart?'start':'center'
        }} onClick={()=>{
            setOptToShow(-1)
            if(prop.ocl){
                prop.ocl()
            }
        }}>
            {prop.isBold?<mye.BTv text={prop.text} size={14} color={mye.mycol.primarycol}  />:<mye.Tv hideOverflow text={prop.text} size={14} color={mye.mycol.imghint} />}
        </div>
    }

    function Opts(prop:{index:number,evt:eventEle, rmvMe:()=>void}) {

        function doIt(action:number){

            mainprop.actiony(action,prop.evt)
        }

        return <div className="ctr" style={{
            flex:(dimen.dsk2)?1:undefined,
            width:(dimen.dsk2)?undefined:100,
            height:40,
            position:'relative'
        }}>
            <div id="clk" className="ctr" style={{
                width:40,
                height:40
            }} onClick={()=>{
                setOptToShow(prop.index)
            }}>
                <MoreVert className="icon" />
            </div>
            <div className="vlc" id="lshdw" style={{
                display:optToShow==prop.index?undefined:'none',
                backgroundColor:mye.mycol.white,
                borderRadius:10,
                width:100,
                position:'absolute',
                top:30,
                left:0,
                zIndex:10
            }}>
                <Close style={{
                    margin:5,
                    fontSize:15,
                    alignSelf:'flex-end',
                    color:mye.mycol.imghint
                }} onClick={()=>{
                    setOptToShow(-1)
                }} />
                <MyCell text="View Event" ocl={()=>{
                    doIt(0)
                }} alignStart special />
                <Line />
                <MyCell text="Edit Event" ocl={()=>{
                    doIt(1)
                }} alignStart special />
                <Line />
                <div style={{
                    width:'100%',
                }}>
                    <MyCell text="Registered Diocese" ocl={()=>{
                        doIt(2)
                    }} alignStart special/>
                    <Line />
                    <MyCell text="Delete" ocl={()=>{
                        setLoad(true)
                        makeRequest.get(`deleteEvent/${prop.evt.getEventId()}`,{},(task)=>{
                            if(task.isSuccessful()){
                                setLoad(false)
                                toast('Deleted successfully',1)
                                setOptToShow(-1)
                                prop.rmvMe()
                            }else{
                                handleError(task)
                            }
                        })
                    }} alignStart special/>
                </div>
            </div>
        </div>
    }


    /*function EventMini(prop:{ele:eventEle}) {
        return <div style={{
            width: 250,
            margin: 10,
            boxSizing:'border-box',
            position:'relative',
            borderRadius:5,
            backgroundImage: `url(${tabcard})`,
            backgroundSize: 'cover',
            padding:10
        }}>
            <div style={{
                width:'100%',
                display:'flex',
                alignItems:'center'
            }}>
                <div className="vlc" style={{
                    padding:3,
                    borderRadius:3,
                    backgroundColor: mye.mycol.primarycol
                }}>
                    <mye.BTv text={prop.ele.getDay()} size={18} color={mye.mycol.white} />
                    <Mgin top={2} />
                    <mye.Tv text={prop.ele.getMonth()} size={14} color={mye.mycol.white} />
                </div>
                <Mgin right={10} />
                <div style={{
                    flex:1
                }}>
                    <mye.BTv text={prop.ele.getTitle()} size={16} color={mye.mycol.primarycol} maxLines={2} />
                </div>
            </div>
            <Mgin top={10} />
            <Line />
            <Mgin top={5} />
            <LrText 
            left={<div>
                <div className="hlc">
                    <LocationOnOutlined style={{
                        color: mye.mycol.primarycol,
                        fontSize:10,
                        marginRight:5,
                    }} />
                    <mye.Tv text={prop.ele.getVenue()} size={12} maxLines={1} color={mye.mycol.primarycol} />
                </div>
                <Mgin top={3} />
                <div className="hlc">
                    <AccessTimeOutlined style={{
                        color: mye.mycol.primarycol,
                        fontSize:10,
                        marginRight:5,
                    }} />
                    <mye.Tv text={prop.ele.getTime()} size={12} maxLines={1} color={mye.mycol.primarycol} />
                </div>
            </div>}
            right={<div className="ctr" style={{
                width:15,
                height:15,
                borderRadius:20,
                backgroundColor:mye.mycol.primarycol
            }} onClick={()=>{

            }}>
                <ArrowRight style={{
                    color:mye.mycol.white,
                    fontSize:12
                }} />
            </div>}
            />
        </div>
    }*/

}

/*
function AddEvent(prop:{closy:(ok?:boolean)=>void}) {
    const location = useLocation()
    const navigate = useNavigate()
    const mye = new myEles(false);
    const dimen = useWindowDimensions()
    const myKey = Date.now()

    const[type,setType] = useState('')
    const[title,setTitle] = useState('')
    const[venue,setVenue] = useState('')
    const[esd,setEsd] = useState<Date>()
    const[askEsd, setAskEsd] = useState(false)
    const[eed,setEed] = useState<Date>()
    const[askEed, setAskEed] = useState(false)
    const[theme, setTheme] = useState('')
    const[fee, setFee] = useState('')

    const[start,setStart] = useState('12:00')
    const[end,setEnd] = useState('14:00')

    const[speakers,setSpeakers] = useState<string[]>([])
    const[add_speaker, setAddSpeaker] = useState('')

    const[art,setArt] = useState<File>()
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(()=>{
    },[])

    function handleError(task:resHandler){
        setLoad(false)
        setError(true)
        if(task.isLoggedOut()){
            navigate(`/adminlogin?rdr=${location.pathname.substring(1)}`)
        }else{
            toast(task.getErrorMsg(),0)
        }
    }

    function addSpeaker(spk:string){
        const tem = [...speakers]
        tem.push(spk)
        setSpeakers(tem)
    }

    function removeSpeaker(pos:number){
        const tem = [...speakers]
        tem.splice(pos, 1);
        setSpeakers(tem)
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
        backgroundColor:mye.mycol.bkg,
        borderRadius:10,
        padding:dimen.dsk2?70:dimen.dsk?40:20,
        boxSizing:'border-box',
        overflow:'scroll',
        height:'75%',
        width:dimen.dsk2?'35%':dimen.dsk?'50%':'80%'
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
        <div className="vlc" style={{
            width:'100%',
        }}>
            <Close className="icon" style={{
                alignSelf:'flex-end'
            }} onClick={()=>{
                prop.closy()
            }}/>
        </div>
        <Mgin top={10} />
        <div style={{
            width:'100%'
        }}>
            <mye.Tv text="Free or Paid?" />
            <Mgin top={3}/>
            <select id="dropdown" name="dropdown" value={type} onChange={(e)=>{
                setType(e.target.value)
            }}>
                <option value="">Please choose</option>
                {Object.entries(spin_pricing).map(([key,value])=>{
                    return <option value={key}>{value}</option>
                })}
            </select>
        </div>
        <div style={{
            width:'100%',
            display:type=='P'?undefined:'none'
        }}>
            <Mgin top={20} />
            <mye.Tv text="*Fee" />
            <Mgin top={3}/>
            <EditTextFilled hint="Event Fee in Naira" min={3} digi value={fee} recv={(v)=>{
                setFee(v.trim())
            }} />
        </div>
        <Mgin top={20} />
        <div style={{
            width:'100%'
        }}>
            <mye.Tv text="*Title" />
            <Mgin top={3}/>
            <EditTextFilled hint="Event title" min={3} value={title} recv={(v)=>{
                setTitle(v.trim())
            }} />
        </div>
        <Mgin top={20} />
        <div style={{
            width:'100%',
            display:'flex'
        }}>
            <div style={{
                flex:1
            }}>
                <mye.Tv text="*Start Date" />
                <Mgin top={5}/>
                <div style={{
                    width:'100%',
                    height:45,
                    borderRadius:8,
                    backgroundColor:mye.mycol.btnstrip,
                    padding:10,
                    boxSizing:'border-box',
                    position:'relative'
                }} >
                    <LrText 
                    left={<div id="clk" onClick={()=>{
                        setAskEsd(true)
                    }}><mye.Tv text={esd?format(esd,'dd-MM-yy'):'DD/MM/YY'} /></div>}
                    right={<CalendarMonthOutlined id="clk" style={{
                        fontSize:20,
                        color:mye.mycol.secondarycol
                    }} onClick={()=>{
                        setAskEsd(true)
                    }}/>}
                    />
                    <div style={{
                        display:askEsd?undefined:'none',
                        position:'absolute',
                        top:0,
                        left:0,
                        zIndex:2,
                        pointerEvents:'auto'
                    }}>
                        <DatePicky fromYear={new Date().getFullYear()} toYear={new Date().getFullYear()+10} focusYear={new Date().getFullYear()} rdy={(d)=>{
                            setAskEsd(false)
                            setEsd(d)
                        }} closy={()=>{
                            setAskEsd(false)
                        }}/>
                    </div>
                </div>
            </div>
            <Mgin right={20} />
            <div style={{
                flex:1
            }}>
                <mye.Tv text="*End Date" />
                <Mgin top={5}/>
                <div style={{
                    width:'100%',
                    height:45,
                    borderRadius:8,
                    backgroundColor:mye.mycol.btnstrip,
                    padding:10,
                    boxSizing:'border-box',
                    position:'relative'
                }} >
                    <LrText 
                    left={<div id="clk" onClick={()=>{
                        setAskEed(true)
                    }}><mye.Tv text={eed?format(eed,'dd-MM-yy'):'DD/MM/YY'} /></div>}
                    right={<CalendarMonthOutlined id="clk" style={{
                        fontSize:20,
                        color:mye.mycol.secondarycol
                    }} onClick={()=>{
                        setAskEed(true)
                    }}/>}
                    />
                    <div style={{
                        display:askEed?undefined:'none',
                        position:'absolute',
                        top:0,
                        left:0,
                        zIndex:2,
                        pointerEvents:'auto'
                    }}>
                        <DatePicky fromYear={new Date().getFullYear()} toYear={new Date().getFullYear()+10} focusYear={new Date().getFullYear()} rdy={(d)=>{
                            setAskEed(false)
                            setEed(d)
                        }} closy={()=>{
                            setAskEed(false)
                        }}/>
                    </div>
                </div>
            </div>
        </div>
        <Mgin top={20} />
        <div style={{
            width:'100%',
            display:'flex'
        }}>
            <div style={{
                flex:1
            }}>
                <mye.Tv text="Start Time" />
                <Mgin top={3}/>
                <TimePicker value={start} onChange={(e)=>{
                    setStart(e as string)
                }} />
            </div>
            <Mgin right={20} />
            <div style={{
                flex:1
            }}>
                <mye.Tv text="Stop Time" />
                <Mgin top={3}/>
                <TimePicker value={end} onChange={(e)=>{
                    setEnd(e as string)
                }} />
            </div>
        </div>
        <Mgin top={20} />
        <div style={{
            width:'100%'
        }}>
            <mye.Tv text="Venue" />
            <Mgin top={3}/>
            <EditTextFilled hint="Venue" min={4} value={venue} recv={(v)=>{
                setVenue(v.trim())
            }} />
        </div>
        <Mgin top={20} />
        <div style={{
            width:'100%'
        }}>
            <mye.Tv text="Theme" />
            <Mgin top={3}/>
            <EditTextFilled hint="Event Theme" min={4} value={theme} recv={(v)=>{
                setTheme(v.trim())
            }} />
        </div>
        <Mgin top={20} />
        <div style={{
            width:'100%',
            display:'flex'
        }}>
            <div style={{
                flex:1,
            }}>
                <EditTextFilled key={speakers.length} hint="Speaker's Name" min={3} value={add_speaker} recv={(v)=>{
                    setAddSpeaker(v.trim())
                }} />
            </div>
            <Mgin right={10} />
            <Btn txt="ADD SPEAKER" width={120} onClick={()=>{
                if(add_speaker.length <3){
                    toast('Speaker Name Too Short',0)
                    return
                }
                addSpeaker(add_speaker)
                setAddSpeaker('')
            }} strip={add_speaker.length <3}/>
        </div>
        <div style={{
            width:'100%',
            display: 'flex',
            flexWrap:'wrap'
        }}>
            {
                speakers.map((sp,i)=>{
                    return <SpeakerMini key={myKey+i+0.002} index={i} txt={sp} cls={()=>{
                        removeSpeaker(i)
                    }} />
                })
            }
        </div>
        <Mgin top={20} />
        <LrText wrap={!dimen.dsk}
        left={<div>
            <mye.Tv text="Add Event Banner" size={12} color={mye.mycol.primarycol}  />
            <div style={{
                display:art?undefined:'none'
            }}>
                <Mgin top={2} />
                <mye.Tv text={`${art?art.name:''} added`} size={12} color={mye.mycol.primarycol} />
            </div>
        </div>}
        right={<div>
            <input
                type="file"
                onChange={(e)=>{
                    const file = e.target.files?.[0];
                    if(file){
                        setArt(file)
                    }
                }}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
           <IconBtn icon={Add} mye={mye} ocl={()=>{
                fileInputRef.current?.click()
            }} text="ATTACH PICTURE" width={150} />
        </div>}
        />
        <Mgin top={20} />
        <Btn txt="CREATE EVENT" onClick={()=>{
            if(type.length==0){
                toast('Please choose free or paid',0)
                return;
            }
            if(!esd){
                toast('Please choose start date',0)
                return;
            }
            if(!eed){
                toast('Please choose end date',0)
                return;
            }
            if(type=='P' && fee.length<3){
                toast('Please set event fee',0)
                return;
            }
            if(title.length<3){
                toast('Please set title',0)
                return;
            }
            if(!start ||  start.length==0){
                toast('Please set start time',0)
                return;
            }
            if(!end || end.length==0){
                toast('Please set stop time',0)
                return;
            }
            if(venue.length<3){
                toast('Please set venue',0)
                return;
            }
            if(theme.length<3){
                toast('Please add theme',0)
                return;
            }
            if(!art){
                toast('Please upload event banner',0)
                return;
            }
            setLoad(true)
            let aspk = ''
            speakers.forEach((sp)=>{
                aspk = aspk+sp+','
            })
            const stp = new Date(eed); 
            stp.setHours(parseInt(end.split(':')[0]), parseInt(end.split(':')[1]), 0);
            const sta = new Date(esd); 
            sta.setHours(parseInt(start.split(':')[0]), parseInt(start.split(':')[1]), 0);
            const tm = new Date(esd); 
            tm.setHours(0, 0, 0);
            makeRequest.post(`setEvent`,{
                title:title,
                time: tm.getTime(),
                start: sta.getTime(),
                end: stp.getTime(),
                venue: venue,
                fee: type=='F'?'0':fee,
                theme: theme,
                speakers: aspk
            },(task)=>{
                if(task.isSuccessful()){
                    const eventId = task.getData()['id']
                    makeRequest.uploadFile(`events`,eventId,getDioceseId(),art, (task)=>{
                        setLoad(false)
                        if(task.isSuccessful()){
                            prop.closy(true)
                        }else{
                            if(task.isLoggedOut()){
                                navigate('/login')
                                return
                            }
                            toast("Could not upload art: "+task.getErrorMsg(),0)
                        }
                    })
                }else{
                    handleError(task)
                }
            })
        }} />
    </div>

    function SpeakerMini(prop:{index:number, txt:string, cls:()=>void}){
        return <div className="hlc" style={{
            padding:8,
            borderRadius:50,
            backgroundColor:mye.mycol.btnstrip,
            margin:5
        }}>
            <mye.BTv text={prop.txt} size={14}  />
            <Mgin right={5} />
            <Close className="icon" onClick={prop.cls} />
        </div>
    }
}*/