import { PersonOutline, FilterOutlined, SortOutlined, SearchOutlined, ListAltOutlined, CloudDownloadOutlined, ArrowBack, ArrowForward, MoreVert, Close, Add, KeyboardArrowDown } from "@mui/icons-material"
import { useState, useEffect } from "react"
import useWindowDimensions from "../../../../helper/dimension"
import { myEles, setTitle, appName, Mgin, Btn, LrText, IconBtn, Line, icony, hexToRgba, ErrorCont } from "../../../../helper/general"
import tabcard from "../../../../assets/tabcard.png"
import { CircularProgress } from "@mui/material"
import Toast from "../../../toast/toast"
import { makeRequest, resHandler } from "../../../../helper/requesthandler"
import { useLocation, useNavigate } from "react-router-dom"
import { defVal, dioceseBasicinfo, dioceseGeneralinfo, dioceseSecretaryInfo, verifStat } from "../../../classes/models"
import { format } from "date-fns"
import { PoweredBySSS } from "../../../../helper/nacdded"



export function AdminDirList(mainprop:{actiony:(action:number,user?:dioceseBasicinfo)=>void}){
    const location = useLocation()
    const navigate = useNavigate()
    const dimen = useWindowDimensions()
    const mye = new myEles(false)
    const[search, setSearch] = useState('')
    const[vpos, setVpos] = useState(1)
    const myKey = Date.now()
    const[optToShow,setOptToShow] = useState(-1)
    const[showingIndex,setShowingIndex] = useState(0)
    const[vStats,setVStats] = useState<verifStat>()
    const[infos,setInfos] = useState<dioceseBasicinfo[]>([])
    
    

    function handleError(task:resHandler,noHarm?:boolean){
        setLoad(false)
        setError(!noHarm)
        if(task.isLoggedOut()){
            navigate(`/adminlogin?rdr=${location.pathname.substring(1)}`)
        }else{
            toast(task.getErrorMsg(),0)
        }
    }

    useEffect(()=>{
        setTitle(`Directory List - ${appName}`)
        getVS()
    },[])

    function getVS(dontGetUsers?:boolean){
        setLoad(true)
        setError(false)
        makeRequest.get('getVerificationStats',{},(task)=>{
            if(task.isSuccessful()){
                setVStats(new verifStat(task.getData()))
                if(dontGetUsers){
                    setLoad(false)
                }else{
                    getUsers(vpos,0)
                }
            }else{
                handleError(task)
            }
        })
    }

    function getUsers(vpos:number, index:number){
        setOptToShow(-1)
        setVpos(vpos)
        setError(false)
        setLoad(true)
        makeRequest.get(`getDioceseByV/${vpos}`,{
            start:(index*20),
            count:20
        },(task)=>{
            setLoad(false)
            if(task.isSuccessful()){
                const tem:dioceseBasicinfo[] = []
                for(const key in task.getData()){
                    const basic = task.getData()[key]['b']
                    const general = task.getData()[key]['g']
                    const mbi = new dioceseBasicinfo(basic)
                    const mgi = new dioceseGeneralinfo(general)
                    mbi.setGeneralData(mgi)
                    tem.push(mbi)
                }
                setInfos(tem)
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
            getVS()
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
        <div style={{
            display:'flex',
            width:'100%',
            flexWrap:'wrap',
            alignItems:'center'
        }}>
            <Tab1 icon={PersonOutline} title="Verified Members" value={vStats?vStats.getTotalVerified():'...'} color={mye.mycol.primarycol} />
            <Tab1 icon={PersonOutline} title="Unverified Members" value={vStats?vStats.getTotalUnverified():'...'} color={mye.mycol.primarycol} />
        </div>
        <Mgin top={20} />
        <div style={{
            width:dimen.dsk?500:'100%',
            display:'flex',
            margin: dimen.dsk?10:5,
        }}>
            <div className="hlc" id="lshdw" style={{
                flex:1,
                backgroundColor:mye.mycol.white,
                borderRadius:10,
            }}>
                <Mgin right={15} />
                <SearchOutlined style={{
                    fontSize:20,
                    color:mye.mycol.imghint
                }} />
                <Mgin right={5} />
                <input className="tinp"
                    type="text"
                    value={search}
                    placeholder="Search"
                    onChange={(e)=>{
                        setSearch(e.target.value)
                    }}
                    style={{
                        width:'100%',
                    }}
                />
            </div>
            <Mgin right={10} />
            <div style={{
                width:100
            }}>
                <Btn txt="Search" onClick={()=>{
                    const sc = search.trim()
                    if(sc.length < 5){
                        toast('Enter at least 5 characters',0)
                        return;
                    }
                    setLoad(true)
                    makeRequest.get('searchMember',{search:search},(task)=>{
                        setLoad(false)
                        if(task.isSuccessful()){
                            setVpos(3)
                            const tem:dioceseBasicinfo[] = []
                            for(const key in task.getData()){
                                const basic = task.getData()[key]['b']
                                const general = task.getData()[key]['g']
                                const mbi = new dioceseBasicinfo(basic)
                                const mgi = new dioceseGeneralinfo(general)
                                mbi.setGeneralData(mgi)
                                tem.push(mbi)
                            }
                            setInfos(tem)
                            setShowingIndex(0)
                        }else{
                            toast('No Result',0)
                        }
                    })
                }} strip={search.length < 5} />
            </div>
        </div>
        <Mgin top={30} />
        <LrText wrap={!dimen.dsk}
        left={vpos==3?<div style={{
            width:250,
            display:'flex'
        }}>
            <div style={{
                flex:1
            }}>
                <Btn txt="Search Result" round onClick={()=>{
                    
                }} width={150} transparent />
            </div>
            <Mgin right={10} />
            <div style={{
                flex:1
            }}>
                <Btn txt="Close Search" round onClick={()=>{
                    getUsers(1,0)
                }}  width={120}/>
            </div>
        </div>:<div style={{
            width:250,
            display:'flex'
        }}>
            <div style={{
                flex:1
            }}>
                <Btn txt="Verified" round onClick={()=>{
                    getUsers(1,0)
                }} transparent={vpos!=1} />
            </div>
            <Mgin right={10} />
            <div style={{
                flex:1
            }}>
                <Btn txt="Unverified" round onClick={()=>{
                    getUsers(0,0)
                }} transparent={vpos!=0}/>
            </div>
            {/* <Mgin right={10} />
            <div style={{
                flex:1
            }}>
                <Btn txt="Deleted" round onClick={()=>{
                    getUsers(2,0)
                }} transparent={vpos!=2}/>
            </div> */}
        </div>}
        right={<div className="flexi">
            <div>
                <OlnBtnPlus text="New User" ocl={()=>{
                    toast('In Dev',2)
                    //mainprop.actiony(3)
                }} />
            </div>
            <Mgin right={10} />
            <OlnBtnPlus text="Bulk CSV" ocl={()=>{

            }} />
            <Mgin right={10} maxOut={!dimen.dsk} />
            <IconBtn icon={CloudDownloadOutlined} mye={mye} text="Download" ocl={()=>{

            }} />
        </div>}
        />
        <Mgin top={15} />
        <div className="vlc" id='lshdw' style={{
            width:'100%',
            backgroundColor:mye.mycol.white,
            borderRadius:10,
            padding:dimen.dsk?20:10,
            boxSizing:'border-box'
        }}>
            <div className="hlc" style={{
                alignSelf:'flex-start'
            }}>
                <PersonOutline style={{
                    color:mye.mycol.secondarycol,
                    fontSize:20
                }} />
                <Mgin right={10}/>
                <mye.HTv text="Individuals" size={16} color={mye.mycol.secondarycol} />
            </div>
            <Mgin top={20} />
            <div className="hlc" style={{
                width:dimen.dsk2?'100%':dimen.dsk?dimen.width-450:dimen.width-60,
                overflowX:'scroll'
            }}>
                <div style={{
                    width:dimen.dsk2?'100%':undefined,
                    paddingBottom:optToShow!=-1?200:0,
                }}>
                    <div className="hlc">
                        <MyCell text="S/N"  isBold/>
                        <MyCell text="Diocese"  isBold/>
                        <MyCell text="Director"  isBold/>
                        <MyCell text="State"  isBold/>
                        <MyCell text="LGA"  isBold/>
                        <MyCell text="Diocese ID"  isBold/>
                        <MyCell text="Phone No."  isBold/>
                        <MyCell text="Action"  isBold/>
                    </div>
                    {
                        infos.map((ele,index)=>{
                            return <div className="hlc" key={myKey+index+showingIndex*20}>
                                <MyCell text={(index+1+showingIndex*20).toString()} />
                                <MyCell text={ele.generalData.getFormattedState()} />
                                <MyCell text={ele.getName()} />
                                <MyCell text={ele.generalData.getFormattedState()} />
                                <MyCell text={ele.generalData.getFormattedLGA()} />
                                <MyCell text={ele.getDioceseID()} />
                                <MyCell text={ele.getPhone()} />
                                <Opts index={index} user={ele} rmvMe={()=>{
                                    const i = index+showingIndex*20
                                    const al = [...infos.slice(0, i), ...infos.slice(i + 1)]
                                    setInfos(al)
                                    getVS(true)
                                }} />
                            </div>
                        })
                    }
                </div>
            </div>
            <Mgin top={20} />
            {vStats?<div className="hlc">
                <ArrowBack id="clk" className="icon" onClick={()=>{
                    if(showingIndex >0){
                        const index = showingIndex-1
                        getUsers(vpos,index)
                    }
                }} />
                <Mgin right={10} />
                {
                    Array.from({length:Math.floor((vpos==1?vStats.getTotalVerified():vStats.getTotalUnverified())/20)+1},(_,index)=>{
                        return <div id="clk" key={myKey+index+10000} className="ctr" style={{
                            width:25,
                            height:25,
                            backgroundColor:showingIndex==index?mye.mycol.black:'transparent',
                            borderRadius:'50%'
                        }} onClick={()=>{
                            getUsers(vpos,index)
                        }}>
                            <mye.BTv text={(index+1).toString()} color={showingIndex==index?mye.mycol.white:mye.mycol.black} size={16}/>
                        </div>
                    })
                }
                <Mgin right={10} />
                <ArrowForward id="clk" className="icon" onClick={()=>{
                    const len = Math.floor((vpos==1?vStats.getTotalVerified():vStats.getTotalUnverified())/20)
                    if(showingIndex < len){
                        const index = showingIndex+1
                        getUsers(vpos,index)
                    }
                }} />
            </div>:<div></div>}
        </div>
        <PoweredBySSS />
    </div>

    function Opts(prop:{index:number,user:dioceseBasicinfo, rmvMe:()=>void}) {

        function doIt(action:number){

            function rndFin(){
                makeRequest.get(`getDioceseSecretaries/${prop.user.getDioceseID()}`,{},(task)=>{
                    if(task.isSuccessful()){
                        let tem:dioceseSecretaryInfo[] = []
                        for (let key in task.getData()){
                            tem.push(new dioceseSecretaryInfo(task.getData()[key]))
                        }
                        prop.user.setSecretaries(tem)
                        mainprop.actiony(action,prop.user)
                    }else{
                        handleError(task)
                    }
                })
            }

            if(prop.user.isPrepared()){
                mainprop.actiony(action,prop.user)
            }else{
                setLoad(true) //~
                if(prop.user.generalData.data == null){
                    makeRequest.get(`getDioceseGeneralInfo/${prop.user.getDioceseID()}`,{},(task)=>{
                        if(task.isSuccessful()){
                            prop.user.setGeneralData(new dioceseGeneralinfo(task.getData()))
                            rndFin()
                        }else{
                            handleError(task)
                        }
                    })
                }else{
                    rndFin()
                }
            }
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
                <MyCell text="View" ocl={()=>{
                    doIt(0)
                }} alignStart special />
                <Line />
                <div style={{
                    width:'100%',
                }}>
                    {/* <MyCell text="Edit" ocl={()=>{
                        doIt(1)
                    }} alignStart special/>
                    <Line /> */}
                    <MyCell text={prop.user.isVerified()?"Deactivate":"Approve"} ocl={()=>{
                        setLoad(true)
                        const ndata = {...prop.user.data}
                        const value = prop.user.isVerified()?'0':'1'
                        ndata['verif'] = value
                        makeRequest.post('setDioceseBasicInfo',ndata,(task)=>{
                            if(task.isSuccessful()){
                                if(!prop.user.isVerified()){
                                    setLoad(false)
                                    prop.user.data['verif'] = value
                                    setOptToShow(-1)
                                    prop.rmvMe()
                                }else{
                                    setLoad(false)
                                    toast('Update successful',1)
                                    prop.user.data['verif'] = value
                                    setOptToShow(-1)
                                    prop.rmvMe()
                                }
                            }else{
                                handleError(task,true)
                            }
                        })
                    }} alignStart special />
                    <Line />
                </div>
            </div>
        </div>
    }

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

    function OlnBtnPlus(prop:{text:string,ocl:()=>void}) {
        return <div id="clk" className="hlc" style={{
            border: `solid ${mye.mycol.primarycol} 1px`,
            padding:9,
            borderRadius:10,
            width:100
        }} onClick={prop.ocl}>
            <LrText 
            left={<mye.Tv text={prop.text} wrapit={false} color={mye.mycol.primarycol}/>}
            right={<Add className="icon" style={{
                fontSize:20
            }} />}
            />
        </div>
    }

    function FiltrLay(prop:{icon:icony,text:string}) {
        return <div id="lshdw" className="hlc" style={{
            padding:10,
            width:dimen.dsk?150:100,
            margin: dimen.dsk?10:5,
            backgroundColor:mye.mycol.white,
            borderRadius:10,
        }}>
            <prop.icon style={{
                fontSize:20,
                color:mye.mycol.imghint
            }} />
            <Mgin right={7} />
            <div style={{
                flex:1
            }}>
                <mye.Tv text={prop.text} color={mye.mycol.imghint} size={12}/>
            </div>
            <KeyboardArrowDown style={{
                fontSize:20,
                color:mye.mycol.imghint
            }} />
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
                <mye.Tv text={prop.title} color={prop.color} />
                <Mgin top={10}/>
                <mye.BTv text={prop.value} size={20}  />
            </div>
        </div>
    }

}

