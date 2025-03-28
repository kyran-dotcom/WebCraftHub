import GameCard from '../components/GameCard';

// SVG icons for game cards
const incrementalSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`;

const chessSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 16l-6 6h18c0-6-3-10-6-12"></path><path d="M8.82 11.68 6.3 9.17a9.85 9.85 0 0 1 0-13.9L12 1l5.7-5.73a9.85 9.85 0 0 1 0 13.9l-2.52 2.51"></path><path d="m16 16-4-4-4 4"></path></svg>`;

const drivingSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M17.83 12a6 6 0 0 0-11.66 0"></path><line x1="12" y1="6" x2="12.01" y2="6"></line><path d="m9 16 3-3 3 3"></path></svg>`;

const Home = () => {
  return (
    <div className="space-y-8">
      <section>
        <div className="py-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Welcome to GameHub
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Play fun online games including incremental clicker games, chess, and driving games.
            Challenge yourself, track your progress, and have fun!
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Featured Games</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <GameCard
            title="Clicker Empire"
            description="Build your cookie empire in this addictive incremental game"
            imageSvg={incrementalSvg}
            link="/games/incremental"
          />
          <GameCard
            title="Classic Chess"
            description="Exercise your brain with the timeless game of chess"
            imageSvg={chessSvg}
            link="/games/chess"
          />
          <GameCard
            title="Speed Racer"
            description="Test your driving skills in this exciting racing game"
            imageSvg={drivingSvg}
            link="/games/driving"
          />
        </div>
      </section>

      <section className="py-8">
        <h2 className="text-2xl font-bold mb-6">How to Play</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2">Clicker Empire</h3>
            <p>Click to earn cookies and purchase upgrades to increase your production rate. The more you click, the more you earn!</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2">Classic Chess</h3>
            <p>Play against a computer opponent. Move pieces according to chess rules and try to checkmate your opponent.</p>
          </div>
          <div className="p-6 bg-card rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2">Speed Racer</h3>
            <p>Use arrow keys or WASD to control your car. Avoid obstacles and complete laps as quickly as possible.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
