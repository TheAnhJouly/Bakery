import { ReactElement } from "react";
import Header from './header/Header'
import { Footer } from './footer/Footer'
import SideBar from "./sidebar/SideBar";
import AdminHeader from "./header/AdminHeader";

export const UserLayout = (Children: ReactElement) => {
    return (
        <div>
            <Header />
            {Children}
            <Footer />
        </div>

    )
}

export const AdminLayout = (Children: ReactElement) => {
    return (
        <div className="">
            <AdminHeader />
            <div className="flex pb-[4rem]">
                <div className="basis-[15%]">
                    <SideBar />
                </div>
                <div className="basis-[80%]">
                    {Children}
                </div>
            </div>
        </div>
    )
}


