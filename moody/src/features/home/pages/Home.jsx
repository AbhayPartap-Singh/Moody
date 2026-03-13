import FaceExpression from "../../auth/components/FaceExpression";
import Player from "../components/Player";
import { useSong } from "../hooks/useSong";

const Home = () => {
  const { song, loading } = useSong();

  return (
    <div>
      <FaceExpression />

      {loading ? (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#cfd600",
          }}
        >
          <p>Loading songs...</p>
        </div>
      ) : (
        <Player song={song} />
      )}
    </div>
  );
};

export default Home;