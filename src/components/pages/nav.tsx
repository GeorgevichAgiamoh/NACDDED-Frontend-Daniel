import { useState } from "react"
import logo from "../../assets/nacdded.png"
import { Mgin, icony, myEles } from "../../helper/general"
import { BuildOutlined, CalendarMonthOutlined, Close, ContactsOutlined, DashboardOutlined, LogoutOutlined, MessageOutlined, PaymentOutlined, PersonOutline, SchoolOutlined, SettingsOutlined, TaskOutlined } from "@mui/icons-material"


export function AdminNav(mainprop:{currentTab:number,mye:myEles,isMobile:boolean, ocl:(pos:number)=>void, showy:()=>void}){

    const[selpos, setSelPos] = useState(mainprop.currentTab)

    return <div style={{
        width:'100%',
        height:'100%',
        overflowY:'scroll',
        backgroundColor: mainprop.mye.mycol.primarycol,
    }}>
        <div className="vlc" style={{
            width: '100%',
        }}>
            <div style={{
                display: mainprop.isMobile?undefined:'none',
                alignSelf:'flex-end'
            }}>
                <Mgin top={10} />
                <div className="ctr" style={{
                    width:50,
                    height:50
                }} onClick={()=>{
                    mainprop.showy()
                }}>
                    <Close style={{
                        color:mainprop.mye.mycol.white
                    }}/>
                </div>
            </div>
            <Mgin top={20} />
            <img height={100} src={logo} alt="NACDDED Logo" />
            <Mgin top={20} />
            <Tab icon={DashboardOutlined} text="Dashboard" pos={0} />
            <Tab icon={ContactsOutlined} text="Directory" pos={1} />
            <Tab icon={TaskOutlined} text="Workflow" pos={2} />
            <Tab icon={PaymentOutlined} text="Payments" pos={3} />
            <Tab icon={MessageOutlined} text="Messages" pos={4} />
            <Tab icon={SettingsOutlined} text="Settings" pos={5} />
            <Tab icon={LogoutOutlined} text="Logout" pos={6} />
            
        </div>
    </div>

    function Tab(prop:{icon:icony, text:string, pos:number}) {
        return <div id="clk" style={{
            display:'flex',
            width:'100%',
            height: 45
        }} onClick={()=>{
            mainprop.ocl(prop.pos)
            setSelPos(prop.pos)
        }}>
            <div style={{
                display: selpos===prop.pos?undefined:' none',
                width:4,
                height:'100%',
                backgroundColor: mainprop.mye.mycol.white
            }}></div>
            <div style={{
                flex:1,
                height:'100%',
                backgroundColor:selpos===prop.pos?'rgba(255,255,255,0.1)':undefined,
                display:'flex',
                alignItems:'center',
            }}>
                <Mgin right={15} />
                <prop.icon style={{
                    fontSize:20,
                    color:mainprop.mye.mycol.white
                }} />
                <Mgin right={20} />
                <mainprop.mye.Tv text={prop.text} color={mainprop.mye.mycol.white} />
            </div>
        </div>
    }
}


export function MemberNav(mainprop:{currentTab:number,mye:myEles,isMobile:boolean, ocl:(pos:number)=>void, showy:()=>void}){

    const[selpos, setSelPos] = useState(mainprop.currentTab)

    return <div style={{
        width:'100%',
        height:'100%',
        overflowY:'scroll',
        backgroundColor: mainprop.mye.mycol.primarycol,
    }}>
        <div className="vlc" style={{
            width: '100%',
        }}>
            <div style={{
                display: mainprop.isMobile?undefined:'none',
                alignSelf:'flex-end'
            }}>
                <Mgin top={10} />
                <div className="ctr" style={{
                    width:50,
                    height:50
                }} onClick={()=>{
                    mainprop.showy()
                }}>
                    <Close style={{
                        color:mainprop.mye.mycol.white
                    }}/>
                </div>
            </div>
            <Mgin top={20} />
            <img height={100}  src={logo} alt="NACDDED Logo" />
            <Mgin top={20} />
            <Tab icon={DashboardOutlined} text="Dashboard" pos={0} />
            <Tab icon={CalendarMonthOutlined} text="Events and Conferences" pos={1} />
            <Tab icon={PaymentOutlined} text="Payments" pos={2} />
            <Tab icon={MessageOutlined} text="Messages" pos={3} />
            <Tab icon={PersonOutline} text="User Profile" pos={4} />
            <Tab icon={SchoolOutlined} text="Schools" pos={5} />
            <Tab icon={LogoutOutlined} text="Logout" pos={6} />
            
        </div>
    </div>

    function Tab(prop:{icon:icony, text:string, pos:number}) {
        return <div id="clk" style={{
            display:'flex',
            width:'100%',
            height: 45
        }} onClick={()=>{
            mainprop.ocl(prop.pos)
            setSelPos(prop.pos)
        }}>
            <div style={{
                display: selpos===prop.pos?undefined:' none',
                width:4,
                height:'100%',
                backgroundColor: mainprop.mye.mycol.white
            }}></div>
            <div style={{
                flex:1,
                height:'100%',
                backgroundColor:selpos===prop.pos?'rgba(255,255,255,0.1)':undefined,
                display:'flex',
                alignItems:'center',
            }}>
                <Mgin right={15} />
                <prop.icon style={{
                    fontSize:20,
                    color:mainprop.mye.mycol.white
                }} />
                <Mgin right={20} />
                <mainprop.mye.Tv text={prop.text} color={mainprop.mye.mycol.white} />
            </div>
        </div>
    }
}

export function InDev(prop:{availables?:string}) {
    const mye = new myEles(false)
    return <div className="ctr" style={{
        width:'100%',
        height:'100%'
    }}>
        <div className="vlc">
            <BuildOutlined style={{
                fontSize:30,
                color:mye.mycol.primarycol
            }} />
            <Mgin top={20} />
            <mye.HTv text={'Available shortly'} />
            <Mgin top={10} />
            <mye.Tv text={'This page will be available shortly'} center />
        </div>
    </div>
}