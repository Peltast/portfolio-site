import { Outlet } from "react-router-dom";


export const SiteLayout = () => {
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