interface PieceProps {
  piece: {
    type: string;
    color: string;
  };
}

const Piece = ({ piece }: PieceProps) => {
  // Get SVG based on piece type and color
  const getSvgIcon = () => {
    const { type, color } = piece;
    
    // Base style for pieces
    const fillColor = color === 'white' ? 'white' : 'black';
    const strokeColor = color === 'white' ? 'black' : 'white';
    
    switch (type) {
      case 'pawn':
        return (
          <svg viewBox="0 0 45 45" width="80%" height="80%">
            <path
              d="M22.5,9c-2.21,0-4,1.79-4,4c0,0.89,0.29,1.71,0.78,2.38C16.83,16.5,15,18.59,15,21c0,2.03,0.94,3.84,2.41,5.03 C15.41,27.09,11,31.58,11,39.5H34c0-7.92-4.41-12.41-6.41-13.47C29.06,24.84,30,23.03,30,21c0-2.41-1.83-4.5-4.28-4.62 c0.49-0.67,0.78-1.49,0.78-2.38C26.5,10.79,24.71,9,22.5,9z"
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );
        
      case 'rook':
        return (
          <svg viewBox="0 0 45 45" width="80%" height="80%">
            <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9,39h27v-3H9v3zM12,36v-4h21v4H12zM11,14V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="butt" />
              <path d="M34,14l-3,3H14l-3-3" />
              <path d="M31,17v12.5H14V17" />
              <path d="M31,29.5l1.5,2.5h-20l1.5-2.5" />
              <path d="M11,14h23" fill="none" />
            </g>
          </svg>
        );
        
      case 'knight':
        return (
          <svg viewBox="0 0 45 45" width="80%" height="80%">
            <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22,10c10.5,1,16.5,8,16,29H15c0-9,10-6.5,8-21" />
              <path d="M24,18c0.38,2.91-5.55,7.37-8,9c-3,2-2.82,4.34-5,4c-1.042-0.94,1.41-3.04,0-3c-1,0,0.19,1.23-1,2 c-1,0-4.003,1-4-4c0-2,6-12,6-12s1.89-1.9,2-3.5c-0.73-0.994-0.5-2-0.5-3c1-1,3,2.5,3,2.5h2c0,0,0.78-1.992,2.5-3c1,0,1,3,1,3" />
              <path d="M9.5,25.5A0.5,0.5,0,1,1,9,25A0.5,0.5,0,1,1,9.5,25.5z" />
              <path d="M14.933,15.75A1.5,1.5,0,1,1,13.433,14.25A1.5,1.5,0,1,1,14.933,15.75z" stroke="none" />
            </g>
          </svg>
        );
        
      case 'bishop':
        return (
          <svg viewBox="0 0 45 45" width="80%" height="80%">
            <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <g fill="none" stroke={strokeColor} strokeLinecap="butt">
                <path d="M9,36C12.39,35.03,19.11,36.43,22.5,34C25.89,36.43,32.61,35.03,36,36" />
                <path d="M9,36c0,2,1.5,2,2.5,4c1,1.5,1,1,0.5,3.5c-1.5,1-1.5,2.5-1.5,2.5h23c0,0,0-1.5-1.5-2.5c-0.5-2.5-0.5-2,0.5-3.5c1-2,2.5-2,2.5-4" />
              </g>
              <path d="M17.5,26h10M15,30h15M22.5,15.5v5M20,18h5" stroke={fillColor === 'white' ? 'black' : 'white'} />
              <circle cx="22.5" cy="14" r="2.5" fill={fillColor} stroke={strokeColor} />
              <path d="M12.5,37c5.5,3.5,14.5,3.5,20,0" fill="none" />
            </g>
          </svg>
        );
        
      case 'queen':
        return (
          <svg viewBox="0 0 45 45" width="80%" height="80%">
            <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8,12a2,2,0,1,1,4,0a2,2,0,1,1,-4,0zM24.5,7.5a2,2,0,1,1,4,0a2,2,0,1,1,-4,0zM41,12a2,2,0,1,1,4,0a2,2,0,1,1,-4,0zM16,8.5a2,2,0,1,1,4,0a2,2,0,1,1,-4,0zM33,9a2,2,0,1,1,4,0a2,2,0,1,1,-4,0z" />
              <path d="M9,26c8.5-1.5,21-1.5,27,0l2-12l-7,11V11l-5.5,13.5l-3-15l-3,15l-5.5-14V25L7,14l2,12z" strokeLinecap="butt" />
              <path d="M9,26c0,2,1.5,2,2.5,4c1,1.5,1,1,0.5,3.5c-1.5,1-1.5,2.5-1.5,2.5h23c0,0,0-1.5-1.5-2.5c-0.5-2.5-0.5-2,0.5-3.5c1-2,2.5-2,2.5-4" />
              <path d="M11.5,30c3.5-1,18.5-1,22,0" fill="none" />
            </g>
          </svg>
        );
        
      case 'king':
        return (
          <svg viewBox="0 0 45 45" width="80%" height="80%">
            <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.5,11.63V6M20,8h5" strokeLinejoin="miter" />
              <path d="M22.5,25c0,0,4.5-7.5,3-10.5c0,0-1-2.5-3-2.5s-3,2.5-3,2.5c-1.5,3,3,10.5,3,10.5" />
              <path d="M11.5,37c5.5,3.5,15.5,3.5,21,0v-7c0,0,9-4.5,6-10.5c-4-6.5-13.5-3.5-16,4V27v-3.5c-3.5-7.5-13-10.5-16-4c-3,6,5,10,5,10V37z" />
              <path d="M11.5,30c5.5-3,15.5-3,21,0" fill="none" />
              <path d="M11.5,33.5c5.5-3,15.5-3,21,0" fill="none" />
              <path d="M11.5,37c5.5-3,15.5-3,21,0" fill="none" />
            </g>
          </svg>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="w-full h-full flex items-center justify-center">
      {getSvgIcon()}
    </div>
  );
};

export default Piece;
