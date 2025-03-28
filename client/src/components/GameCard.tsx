import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface GameCardProps {
  title: string;
  description: string;
  imageSvg: string;
  link: string;
}

const GameCard = ({ title, description, imageSvg, link }: GameCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="rounded-md overflow-hidden aspect-[16/9] bg-muted flex items-center justify-center mb-4">
          <div className="w-24 h-24 text-primary" dangerouslySetInnerHTML={{ __html: imageSvg }} />
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={link}>Play Now</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameCard;
