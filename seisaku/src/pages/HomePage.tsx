import hot from "../assets/hot.jpg"; //画像のインポート

const Home = () => {
  return (
    <div className="relative m-0 p-0">

      <img
        src={hot}
        className="w-full h-screen object-cover object-top block"
        alt="食べ物を捨てない生活へ"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white  rounded-2xl">
        <h1 className="text-3xl sm:text-5xl font-bold mb-4 ">
          あなたの冷蔵庫管理
        </h1>
        <p className="text-sm">食材を無駄にしない暮らしをサポート！</p>
      </div>
    </div>
  );
};

export default Home;
