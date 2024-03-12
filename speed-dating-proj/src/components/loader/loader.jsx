import wavy_background from "../../assets/wavy_background.png";
import React, {useEffect} from "react";
import './loader.css';

const Loader = () => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";
        script.type="module";
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);
    return (
        <div  className="fullscreen loader-main">
            <div className="fullscreen animation-wrapper">
                <dotlottie-player src="https://lottie.host/435fb35f-b7f9-41f8-8b71-71138ea6ac76/pPkuGxlFhj.json" background="transparent" speed="1"
                                  style={{width: '300px', height: '300px'}} loop autoplay/>
            </div>
        </div>
    )
};
export default Loader;

