import FaceExpression from "../../auth/components/FaceExpression";
import Player from "../components/Player";
import { useSong } from "../hooks/useSong";

const Home = () => {

  const { song } = useSong();

  return (

    <div className="moody-app">

      <h1 className="moody-title">Moody</h1>

      <FaceExpression />

      <Player song={song} />

    </div>

  );

};

export default Home;