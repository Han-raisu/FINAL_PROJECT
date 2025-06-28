import hot from "../assets/hot.jpg"; //画像のインポート

const Home = () => {
  return (
    <div className="relative m-0 p-0">
      <img
        src={hot}
        className="w-full h-screen object-cover object-top block"
        alt="食べ物を捨てない生活へ"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 drop-shadow-lg ">
          あなたの冷蔵庫管理
        </h1>
        <p className="text-lg sm:text-xl font-semibold drop-shadow-md ">食材を無駄にしない暮らしをサポート！</p>
      </div>
    </div>
  );
};

export default Home;
