import FaceExpression from "../../auth/components/FaceExpression";
import Player from "../components/Player";
import { useSong } from "../hooks/useSong";

const Home = () => {

  const { song } = useSong();

  return (

    <div className="app-wrapper">
    

      <h1 className="app-title">MOODY AI</h1>

      <FaceExpression />

      <Player song={song} />

    </div>

  );
};

export default Home;