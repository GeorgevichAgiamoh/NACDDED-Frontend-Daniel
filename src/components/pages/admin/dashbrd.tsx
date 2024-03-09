import { PersonOutline, SavingsOutlined, VolumeUpOutlined, ArrowRightOutlined, Close, AttachFile, Mail, PieChart, MonetizationOnOutlined, BusinessOutlined, CalendarMonthOutlined, AccessTimeOutlined, LocationOnOutlined, ArrowRight, ArrowCircleRightOutlined, DeleteOutline, CalendarTodayOutlined, MoreVert } from "@mui/icons-material";
import { useState, useEffect } from "react";
import useWindowDimensions from "../../../helper/dimension";
import { myEles, setTitle, appName, Mgin, LrText, BtnIcn, icony, IconBtn, ErrorCont, MyPieChart, hexToRgba, Line } from "../../../helper/general";
import { annEle, eventEle, highlightEle } from "../../classes/models";
import { CircularProgress } from "@mui/material";
import Toast from "../../toast/toast";
import { makeRequest, resHandler } from "../../../helper/requesthandler";
import { useLocation, useNavigate } from "react-router-dom";
import tabcard from "../../../assets/tabcard.png"
import { PoweredBySSS, getGreeting } from "../../../helper/nacdded";
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';





export function AdminDashboard(mainprop:{goto:(action:number)=>void}){
    const location = useLocation()
    const navigate = useNavigate()
    const mye = new myEles(false);
    const myKey = Date.now()
    const dimen = useWindowDimensions();
    const[showNewAnn, setShowNewAnn] = useState(false)
    const[hele,setHele] = useState<highlightEle>()
    const[anns,setAnns] = useState<annEle[]>([])
    const[atitle, setATitle] = useState('')
    const[upevents,setUpEvents] = useState<eventEle[]>([])
    const[amsg, setAMsg] = useState('')
    const[optToShow,setOptToShow] = useState(-1)

    //Calender
    const[focusYear, setFocusYear] = useState(new Date())

    useEffect(()=>{
        setTitle(`Admin Dashboard - ${appName}`)
        getHgl()
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

    function getHgl(){
        setError(false)
        makeRequest.get('getHighlights',{},(task)=>{
            if(task.isSuccessful()){
                setHele(new highlightEle(task.getData()))
                getAnns()
            }else{
                handleError(task)
            }
        })
    }

    function getAnns(){
        setError(false)
        makeRequest.get('getAnnouncements',{},(task)=>{
            if(task.isSuccessful()){
                const tem:annEle[] = []
                for(const key in task.getData()){
                    tem.push(new annEle(task.getData()[key]))
                }
                setAnns(tem)
            }else{
                handleError(task)
            }
        })
        setOptToShow(-1)
        const currentDate = new Date();
        const futureDate = new Date(currentDate);
        futureDate.setFullYear(currentDate.getFullYear() + 10);
        makeRequest.get('getEvents',{
            from: currentDate.getTime(),
            to: futureDate.getTime()
        },(task)=>{
            if(task.isSuccessful()){
                const tem:eventEle[] = []
                for(const key in task.getData()){
                    tem.push(new eventEle(task.getData()[key]))
                }
                if(tem.length!=0){
                    setFocusYear(tem[0].getUnformattedDate())
                }
                setUpEvents(tem)
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
            getHgl()
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
        <mye.BTv text="Hello Admin" size={26} color={mye.mycol.primarycol} />
        <Mgin top={20} />
        <mye.Tv text={`Good ${getGreeting()}, welcome to your dashboard`} />
        <Mgin top={30} />
        <div style={{
            display:'flex',
            width:'100%',
            flexWrap:'wrap',
            alignItems:'center'
        }}>
            <Tab1 icon={PersonOutline} title="Schools" value={hele?hele.totalSchools():'...'} color={mye.mycol.primarycol} />
            <Tab1 icon={BusinessOutlined} title="Diocese" value={hele?hele.totalDiocese():'...'} color={mye.mycol.primarycol} />
        </div>
        <Mgin top={20} />
        <div style={{
            width:'100%',
            display: dimen.dsk?'flex':undefined
        }}>
            <div id="lshdw" style={{
                backgroundColor:mye.mycol.white,
                borderRadius:10,
                padding:dimen.dsk?20:10,
                boxSizing:'border-box',
                width:dimen.dsk?undefined:'100%',
                flex: dimen.dsk?1:undefined
            }}>
                <div className="hlc">
                    <CalendarMonthOutlined style={{
                        fontSize:25,
                        color: mye.mycol.secondarycol
                    }} />
                    <Mgin right={10} />
                    <mye.BTv text="Event Calender" size={18} color={mye.mycol.secondarycol} />
                </div>
                <Mgin top={10} />
                <DayPicker key={focusYear.getTime()}
                    mode="single"
                    defaultMonth={focusYear}
                    modifiers={{
                        custom_selected: upevents.map((ev,i)=>{
                            return ev.getUnformattedDate()
                        })
                    }}
                    modifiersStyles={{
                        custom_selected: {
                            backgroundColor: mye.mycol.secondarycol,
                            borderRadius:5,
                            color:mye.mycol.white
                        }
                    }}
                    />
            </div>
            <Mgin right={dimen.dsk?20:0} top={dimen.dsk?0:20} />
            <div id="lshdw" style={{
                backgroundColor:mye.mycol.white,
                borderRadius:10,
                padding:dimen.dsk?20:10,
                boxSizing:'border-box',
                width:dimen.dsk?undefined:'100%',
                flex: dimen.dsk?2:undefined
            }}>
                <div className="hlc">
                    <CalendarTodayOutlined style={{
                        fontSize:25,
                        color: mye.mycol.secondarycol
                    }} />
                    <Mgin right={10} />
                    <mye.BTv text="Upcoming Events" size={18} color={mye.mycol.secondarycol} />
                </div>
                <Mgin top={10} />
                <div style={{
                    width:'100%',
                    paddingBottom:optToShow!=-1?200:0,
                }}>
                    <div className="hlc">
                        <MyCell text="Event Title"  isBold/>
                        <MyCell text="Event Date"  isBold/>
                        <MyCell text="Venue"  isBold/>
                        <MyCell text=""  isBold/>
                    </div>
                    {
                        upevents.map((ele,index)=>{
                            return <div key={myKey+index+0.21}>
                                <Line />
                                <div className="hlc" >
                                    <MyCell text={ele.getTitle()} />
                                    <MyCell text={ele.getDate()} />
                                    <MyCell text={ele.getVenue()} />
                                    <Opts index={index} evt={ele} rmvMe={()=>{
                                        const al = [...upevents.slice(0, index), ...upevents.slice(index + 1)]
                                        setUpEvents(al)
                                        // Get Events again
                                    }} />
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
        <Mgin top={20} />
        <div id="lshdw" style={{
            width:'100%',
            padding:20,
            boxSizing:'border-box',
            backgroundColor:mye.mycol.bkg,
            borderRadius:10,
        }}>
            <div className="hlc">
                <VolumeUpOutlined style={{
                    color:mye.mycol.secondarycol,
                    fontSize:20
                }} />
                <Mgin right={10}/>
                <mye.HTv text="Announcement" size={16} color={mye.mycol.secondarycol} />
            </div>
            <Mgin top={20} />
            {
                anns.map((ann,index)=>{
                    return <AnnLay ele={ann} key={index+myKey+1} rmvMe={()=>{
                        const an = [...anns.slice(0, index), ...anns.slice(index + 1)]
                        setAnns(an)
                    }}/>
                })
            }
             <Mgin top={20} />
             <LrText 
             left={<div id="clk" className="hlc" onClick={()=>{

             }}>
                <mye.HTv text="View All Announcements" color={mye.mycol.primarycol} size={12} />
                <Mgin right={10} />
                <ArrowRightOutlined className="icon" />
             </div>}
             right={<div id="clk" className="hlc" onClick={()=>{
                setShowNewAnn(true)
             }}>
                <mye.HTv text="Make Announcement" color={mye.mycol.primarycol} size={12} />
                <Mgin right={10} />
                <ArrowRightOutlined className="icon" />
             </div>}
             />
        </div>
        <PoweredBySSS />

        {/* Absolutely positioned (dialog) */}
        <div className="ctr" style={{
            display:showNewAnn?undefined:'none',
            position:'absolute',
            top:0,
            left:0,
            width:'100%',
            height:'100%',
            boxSizing:'border-box',
            backgroundColor:'rgba(0,0,0,0.1)',
            padding: dimen.dsk?'10% 25%':0
        }}>
            <div style={{
                backgroundColor: mye.mycol.bkg,
                width:'100%',
                height:'100%',
                display:'flex',
                flexDirection:'column',
                borderRadius:10
            }}>
                <div style={{
                    backgroundColor:mye.mycol.primarycol,
                    padding:'10px 20px',
                    borderRadius:'10px 10px 0 0'
                }}>
                    <LrText 
                    left={<mye.HTv text="New Announcement" color={mye.mycol.white} size={16} />}
                    right={<BtnIcn icon={Close} color={mye.mycol.white} ocl={()=>{
                        setShowNewAnn(false)
                    }}  />}
                    />
                </div>
                <div style={{
                    width:'100%',
                    flex:1,
                    boxSizing:'border-box',
                    padding:'15px 30px',
                    display:'flex',
                    flexDirection:'column'
                }}>
                    <Mgin top={20} />
                    <input className="tinp"
                        type="text"
                        value={atitle}
                        placeholder="Title"
                        onChange={(e)=>{
                            setATitle(e.target.value)
                        }}
                        style={{
                            width:'100%',
                        }}
                    />
                    <Mgin top={5} />
                    <div style={{width:'100%',height:1,backgroundColor:'rgba(0,0,0,0.1)'}}></div>
                    <textarea
                        value={amsg}
                        placeholder="Type message here"
                        onChange={(e)=>{
                            setAMsg(e.target.value)
                        }}
                        style={{
                            flex:1,
                            marginTop:10,
                            width:'100%',
                            border:'none',
                            outline:'none',
                            resize:'none'
                        }}
                    />
                    <div style={{width:'100%',height:1,backgroundColor:'rgba(0,0,0,0.1)'}}></div>
                    <Mgin top={20} />
                    <div className="hlc" style={{
                        alignSelf:'flex-end'
                    }}>
                        <AttachFile id='clk' className="icon" style={{
                            fontSize:18
                        }} />
                        <Mgin right={10} />
                        <IconBtn icon={Mail} mye={mye} text={"SUBMIT"} ocl={()=>{
                            if(atitle.trim().length ==0){
                                toast('Please enter title',0)
                                return;
                            }
                            if(amsg.trim().length <3){
                                toast('Please enter message',0)
                                return;
                            }
                            setLoad(true)
                            makeRequest.post('setAnnouncements',{
                                title:atitle.trim(),
                                msg:amsg.trim(),
                                time:Date.now().toString()
                            },(task)=>{
                                if(task.isSuccessful()){
                                    toast('Announcement added',1)
                                    setShowNewAnn(false)
                                    getAnns()
                                }else{
                                    setLoad(false)
                                    handleError(task)
                                }
                            })
                        }}  width={120}/>
                    </div>
                </div>
            </div>
        </div>
    </div>

    function MyCell(prop:{text:string,isBold?:boolean,alignStart?:boolean,ocl?:()=>void, special?:boolean}) {
        return <div id={prop.special?'clk':undefined} className="ctr" style={{
            flex:1,
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

            //mainprop.go(action,prop.evt)
        }

        return <div className="ctr" style={{
            flex:1,
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
                <div style={{
                    width:'100%',
                }}>
                    <MyCell text="View Registered Members" ocl={()=>{
                        doIt(1)
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

    function EventMini(prop:{ele:eventEle}) {
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
    }

    function AnnLay(prop:{ele:annEle, rmvMe:()=>void}) {
        return <div style={{
            width:'100%',
            boxSizing:'border-box',
            padding:10
        }}>
            <div style={{
                width:'100%',
                display:'flex',
                alignItems:'center'
            }}>
                <div style={{
                    flex:2,
                    boxSizing:'border-box',
                    paddingRight:dimen.dsk2?100:dimen.dsk?50:20
                }}>
                    <mye.Tv text={prop.ele.getMsg()} color={mye.mycol.imghint} maxLines={2} size={12} />
                </div>
                <div className="ctr" style={{
                    flex:1
                }}>
                    <mye.Tv text={prop.ele.getTime()} size={12} color={mye.mycol.primarycol} />
                </div>
                <div className="ctr" style={{
                    flex:1
                }}>
                    <mye.Tv text={'View'} size={12} color={mye.mycol.primarycol} onClick={()=>{

                    }} />
                </div>
                <div className="ctr" style={{
                    flex:1
                }}>
                    <DeleteOutline style={{
                        fontSize:25,
                        color: mye.mycol.red
                    }} onClick={()=>{
                        setLoad(true)
                        makeRequest.post('deleteAnnouncements',{id: prop.ele.getId()},(task)=>{
                            setLoad(false)
                            if(task.isSuccessful()){
                                prop.rmvMe()
                            }else{
                                handleError(task)
                            }
                        })
                    }} />
                </div>
            </div>
            <Mgin top={10} />
            <div style={{width:'100%',height:1,backgroundColor:'rgba(0,0,0,0.1)'}}></div>
        </div>
    }

    function Tab1(prop:{title:string, value:string, icon:icony, color:string}) {
        
        return <div id="lshdw" style={{
            width: dimen.dsk?300:'100%',
            margin: dimen.dsk?20:'10px 0px',
            height:150,
            boxSizing:'border-box',
            position:'relative',
            borderRadius:10,
            backgroundImage: `url(${tabcard})`,
            backgroundSize: 'cover',
        }}>
            <div className="ctr" style={{
                width:70,
                height:70,
                backgroundColor:hexToRgba(prop.color,0.1),
                borderRadius:'50%',
                position:'absolute',
                top:20,
                right:20
            }}>
                <prop.icon style={{
                    fontSize:20,
                    color: prop.color
                }} />
            </div>
            <div style={{
                position:'absolute',
                left:20,
                bottom:20
            }}>
                <mye.Tv text={prop.title} color={mye.mycol.primarycol} />
                <Mgin top={10}/>
                <mye.BTv text={prop.value} size={20}  />
            </div>
        </div>
    }
}