import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useWindowDimensions from "../../../../helper/dimension";
import { Btn, DatePicky, EditTextFilled, ErrorCont, IconBtn, LrText, Mgin, appName, myEles, spin_pricing } from "../../../../helper/general";
import { eventEle } from "../../../classes/models";
import { Close, CalendarMonthOutlined, Add, ArrowBack } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { format } from "date-fns";
import TimePicker from "react-time-picker";
import { resHandler, makeRequest, getDioceseId } from "../../../../helper/requesthandler";
import Toast from "../../../toast/toast";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';


export function NewEvent(mainprop:{ev?:eventEle, backy:()=>void}){
    const location = useLocation()
    const navigate = useNavigate()
    const mye = new myEles(false);
    const [myKey, setMyKey] = useState(Date.now())
    const dimen = useWindowDimensions();

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
        setTitle(`${mainprop.ev?'Edit':'New'} Event - ${appName}`)
        if(mainprop.ev){
            setType(mainprop.ev.getFee()=='0'?'F':'P')
            setTitle(mainprop.ev.getTitle())
            setVenue(mainprop.ev.getVenue())
            setEsd(new Date(mainprop.ev.getStart()))
            setEed(new Date(mainprop.ev.getEnd()))
            setTheme(mainprop.ev.getTheme())
            setFee(mainprop.ev.getFee())
            setStart(mainprop.ev.getStartTime())
            setEnd(mainprop.ev.getEndTime())
            setSpeakers(mainprop.ev.getSpeakers())
            setMyKey(Date.now())
        }
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

    return <div key={myKey} style={{
        width:'100%',
        boxSizing:'border-box',
        padding:dimen.dsk?'40px 80px':20
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
        <div id="clk" className="hlc" onClick={()=>{
            mainprop.backy()
        }}>
            <ArrowBack className="icon" />
            <Mgin right={10} />
            <mye.HTv text="Go Back" size={14} />
        </div>
        <Mgin top={20} />
        <div id="lshdw" className="vlc" style={{
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            boxSizing:'border-box',
            padding:dimen.dsk?'60px 100px':10
        }}>
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
                <mye.Tv text="*Price Of The Ticket" />
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
                <mye.Tv text="Event Description" />
                <Mgin top={3}/>
                <EditTextFilled hint="Type Event Description" min={4} value={theme}  recv={(v)=>{
                    setTheme(v.trim())
                }} singleLine={false} />
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
                }} strip={add_speaker.length <3} />
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
                <mye.BTv text="Add Event Banner" size={14} color={mye.mycol.primarycol}  />
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
                                mainprop.backy()
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


}