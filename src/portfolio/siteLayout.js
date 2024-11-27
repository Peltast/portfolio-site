import React from "react";
import { Outlet, useLocation } from "react-router-dom";


export const SiteLayout = () => {
    const location = useLocation();
    
    React.useLayoutEffect(() => {
        document.documentElement.scrollTo({ top:0, left:0, behavior: "instant" });
    }, [location.pathname]);

    return (
        <div>
            <Outlet />

            <div className="footer">
                <a href="mailto:pmcgrath@peltastdesign.com">
                    <div>Email</div>
                </a>
                <a href="https://twitter.com/PeltastDesign" target="_blank">
                    <div>Twitter</div>
                </a>

            </div>
        </div>
    );
}

export default SiteLayout;