import { PersonOutline, SavingsOutlined, VolumeUpOutlined, ArrowRightOutlined, Close, AttachFile, Mail, PieChart, ArrowCircleRightOutlined, MonetizationOnOutlined, LocationOnOutlined, AccessTimeOutlined, ArrowRight, CalendarMonthOutlined } from "@mui/icons-material";
import { useState, useEffect } from "react";
import useWindowDimensions from "../../../helper/dimension";
import { myEles, setTitle, appName, Mgin, LrText, BtnIcn, icony, IconBtn, Btn, ErrorCont, Line } from "../../../helper/general";
import { annEle, dioceseBasicinfo, dioceseGeneralinfo, eventEle, eventRegEle, payRecordEle } from "../../classes/models";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgress, LinearProgress } from "@mui/material";
import Toast from "../../toast/toast";
import { getDioceseId, makeRequest, resHandler } from "../../../helper/requesthandler";
import { PoweredBySSS, getGreeting } from "../../../helper/nacdded";
import tabcard from "../../../assets/tabcard.png"




export function MemberDashboard(mainprop:{mbi:dioceseBasicinfo,mgi?:dioceseGeneralinfo,yearsOwed:string[],goto:(action:number)=>void}){
    const location = useLocation()
    const navigate = useNavigate()
    const mye = new myEles(false);
    const myKey = Date.now()
    const dimen = useWindowDimensions();
    const[anns,setAnns] = useState<annEle[]>([])
    const[upevents,setUpEvents] = useState<eventEle[]>([])
    const[myEvents, setMyEvents] = useState<eventRegEle[]>([])


    useEffect(()=>{
        setTitle(`Diocese Dashboard - ${appName}`)
        getAnns()
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
                setUpEvents(tem)
            }else{
                handleError(task)
            }
        })

        makeRequest.get(`getDioceseEventRegs/${getDioceseId()}`,{
            start:0,
            count:3
        },(task)=>{
            if(task.isSuccessful()){
                const tem:eventRegEle[] = []
                for(const key in task.getData()){
                    tem.push(new eventRegEle(task.getData()[key]))
                }
                setMyEvents(tem)
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
            getAnns()
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
        <div>
            <mye.HTv text={`Hello, ${mainprop.mbi.getName()}`} size={26} color={mye.mycol.primarycol} />
            <Mgin top={20} />
            <mye.Tv text={`Good ${getGreeting()}, welcome to your dashboard`} />
        </div>
        <Mgin top={30} />
        <div id="lshdw" style={{
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            padding:dimen.dsk?40:20,
            boxSizing:'border-box',
            width:'100%'
        }}>
            <LrText 
            left={<div className="hlc">
                <PersonOutline style={{
                    fontSize:25,
                    color: mye.mycol.secondarycol
                }} />
                <Mgin right={10} />
                <mye.BTv text="Account Verification" size={20} color={mye.mycol.secondarycol} />
            </div>}

            right={<div style={{
                padding:'5px 10px',
                borderRadius:50,
                backgroundColor: mainprop.mbi.isVerified()?mye.mycol.greenstrip:mye.mycol.redstrip
            }}>
                <mye.Tv text={mainprop.mbi.isVerified()?'Verified':'Unverified'} color={mainprop.mbi.isVerified()?mye.mycol.green:mye.mycol.red} />
            </div>}
            />
            <Mgin top={15} />
            <div style={{
                backgroundColor: mye.mycol.imghintr2,
                borderRadius:10,
                padding:10,
                width:'100%',
                display:'flex',
                alignItems:'center'
            }}>
                <div style={{
                    flex:1
                }}>
                    <LinearProgress variant="determinate" value={(mainprop.mbi.isVerified() && mainprop.mgi)?100:(mainprop.mgi)?50:25} 
                    sx={{
                        height: 10, // Set the height of the progress bar
                        borderRadius: 5, // Set the border radius for rounded corners
                        backgroundColor: mye.mycol.imghintr2, // Set the background color
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#4caf50', // Set the progress bar color
                        },
                      }} />
                </div>
                <Mgin right={10} />
                <mye.BTv text={((mainprop.mbi.isVerified() && mainprop.mgi)?'100':(mainprop.mgi)?'50':'25')+'%'} color={mye.mycol.primarycol} size={20}  />
            </div>
            <Mgin top={15} />
            <LrText 
            left={<mye.Tv text="" />}
            right={<div id="clk" className="hlc" onClick={()=>{
                    mainprop.goto(4)
                }} >
                <mye.Tv text="Continue Verification" color={mye.mycol.primarycol}/>
                <Mgin right={5} />
                <ArrowCircleRightOutlined className="icon" />
            </div>}
            />
        </div>
        {mainprop.yearsOwed.length==0?<div></div>:<div style={{
            width:'100%',
        }}>
            <Mgin top={20} />
            <div id="lshdw" style={{
                backgroundColor:mye.mycol.white,
                borderRadius:10,
                padding:dimen.dsk?40:20,
                boxSizing:'border-box',
                width:'100%'
            }}>
                <div className="hlc">
                    <MonetizationOnOutlined style={{
                        fontSize:25,
                        color: mye.mycol.secondarycol
                    }} />
                    <Mgin right={10} />
                    <mye.BTv text="Dues Payment" size={20} color={mye.mycol.secondarycol} />
                </div>
                <Mgin top={30} />
                <LrText 
                left={<mye.Tv text={`Next payment of N3,000 is due for 1st Jan ${mainprop.yearsOwed[0]}`} />}
                right={<div className="hlc">
                    <mye.Tv text="Pay" color={mye.mycol.primarycol} onClick={()=>{
                        mainprop.goto(2)
                    }} />
                    <Mgin right={20} />
                    <mye.Tv text="View"  onClick={()=>{
                        mainprop.goto(2)
                    }} />
                </div>}
                />
            </div>
        </div>}
        <Mgin top={20} />
        <div id="lshdw" style={{
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            padding:dimen.dsk?40:20,
            boxSizing:'border-box',
            width:'100%'
        }}>
            <div className="hlc">
                <CalendarMonthOutlined style={{
                    fontSize:25,
                    color: mye.mycol.secondarycol
                }} />
                <Mgin right={10} />
                <mye.BTv text="Upcoming Events" size={20} color={mye.mycol.secondarycol} />
            </div>
            <Mgin top={20} />
            <div className="hlc" style={{
                width:'100%',
                overflowX:'scroll'
            }}>
                {
                    upevents.map((ev, i )=>{
                        return  <EventMini ele={ev} key={myKey+i+0.321} />
                    })
                }
            </div>
            <Mgin top={20} />
            <LrText 
            left={<mye.Tv text="" />}
            right={<div id="clk"  className="hlc" onClick={()=>{
                    mainprop.goto(1)
                }} >
                <mye.Tv text="View all Events" color={mye.mycol.primarycol}/>
                <Mgin right={5} />
                <ArrowCircleRightOutlined className="icon" />
            </div>}
            />
        </div>
        <Mgin top={20} />
        <RegEventsLay events={myEvents} />
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
                    return <AnnLay ele={ann} key={index+myKey+1} />
                })
            }
             <Mgin top={20} />
             <div id="clk" className="hlc" onClick={()=>{

             }}>
                <mye.HTv text="View Announcements" color={mye.mycol.primarycol} size={12} />
                <Mgin right={10} />
                <ArrowRightOutlined className="icon" />
             </div>
        </div>
        <PoweredBySSS />
    </div>

    function  RegEventsLay(prop:{events:eventRegEle[]}) {
        const [mykey, setMyKey] = useState(Date.now())

        useEffect(()=>{
            prop.events.forEach((ev,i)=>{
                ev.registerRecall(()=>{
                    setMyKey(Date.now())
                })
            })
        },[])

        return <div key={mykey} id="lshdw" style={{
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            padding:dimen.dsk?40:20,
            boxSizing:'border-box',
            width:'100%'
        }}>
            <div className="hlc">
                <CalendarMonthOutlined style={{
                    fontSize:25,
                    color: mye.mycol.secondarycol
                }} />
                <Mgin right={10} />
                <mye.BTv text="Registered Events" size={20} color={mye.mycol.secondarycol} />
            </div>
            <Mgin top={20} />
            <div className="hlc" style={{
                width:dimen.dsk2?'100%':dimen.dsk?dimen.width-450:dimen.width-60,
                overflowX:'scroll'
            }}>
                <div style={{
                    width:dimen.dsk2?'100%':undefined,
                }}>
                    <div className="hlc">
                        <MyCell text="Date"  isBold  special/>
                        <MyCell text="Event Title"  isBold/>
                        <MyCell text="Address"  isBold/>
                        <MyCell text="Time"  isBold/>
                        <MyCell text="Action"  isBold special/>
                    </div>
                    {
                        prop.events.map((ele,index)=>{
                            return <div className="hlc" key={myKey+index}>
                                <MyCell text={''} special customLay={<div className="vlc" style={{
                                    padding:'2px 6px',
                                    borderRadius:3,
                                    backgroundColor: mye.mycol.btnstrip
                                }}>
                                    <mye.BTv text={ele.event.getDay()} size={14} color={mye.mycol.primarycol} />
                                    <Mgin top={2} />
                                    <mye.Tv text={ele.event.getMonth()} size={12} color={mye.mycol.primarycol} />
                                </div>} />
                                <MyCell text={ele.event.getTitle()} />
                                <MyCell text={ele.event.getVenue()} />
                                <MyCell text={ele.event.getDate()+', '+ele.event.getTime()} />
                                <MyCell text={''} special customLay={<mye.Tv text="View" color={mye.mycol.primarycol} onClick={()=>{

                                }} />} />
                            </div>
                        })
                    }
                </div>
            </div>
            <Mgin top={20} />
            <LrText 
            left={<mye.Tv text="" />}
            right={<div id="clk"  className="hlc" onClick={()=>{
                    mainprop.goto(1)
                }} >
                <mye.Tv text="View all Events" color={mye.mycol.primarycol}/>
                <Mgin right={5} />
                <ArrowCircleRightOutlined className="icon" />
            </div>}
            />
        </div>
    }

    function MyCell(prop:{text:string,isBold?:boolean,ocl?:()=>void, special?:boolean, tCol?:string, customLay?:any}) {
        return <div id={prop.special?'clk':undefined} className="ctr" style={{
            flex:(dimen.dsk2 && !prop.special)?1:undefined,
            width:(dimen.dsk2 && !prop.special)?undefined:100,
            height:60,
            boxSizing:'border-box',
            alignItems: 'start'
        }} onClick={()=>{
            if(prop.ocl){
                prop.ocl()
            }
        }}>
            {prop.customLay?prop.customLay:prop.isBold?<mye.BTv text={prop.text} size={14} color={mye.mycol.primarycol}  />:<mye.Tv hideOverflow text={prop.text} size={14} color={prop.tCol||mye.mycol.imghint} />}
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

function AnnLay(prop:{ele:annEle}) {
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
            <div style={{
                flex:1,
            }}>
                <LrText 
                left={<mye.Tv text={prop.ele.getTime()} size={12} color={mye.mycol.primarycol} />}
                right={<mye.Tv text={'View'} size={12} color={mye.mycol.primarycol} onClick={()=>{

                }} />}
                />
            </div>
        </div>
        <Mgin top={10} />
        <div style={{width:'100%',height:1,backgroundColor:'rgba(0,0,0,0.1)'}}></div>
    </div>
}

}