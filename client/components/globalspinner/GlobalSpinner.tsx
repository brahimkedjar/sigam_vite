// components/GlobalSpinner.tsx
import { Box, Backdrop, keyframes, styled } from '@mui/material';
import { useLoading } from '@/components/globalspinner/LoadingContext';

// Letter charging animations
const letterGlow = keyframes`
  0%, 100% { 
    transform: scale(1);
    text-shadow: 0 0 0 rgba(59, 130, 246, 0);
    color: rgba(255, 255, 255, 0.3);
  }
  50% { 
    transform: scale(1.2);
    text-shadow: 0 0 15px rgba(59, 130, 246, 0.9);
    color: #3b82f6;
  }
`;

const SigamLoaderContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.5rem',
});

const Letter = styled(Box)<{ delay: string }>(({ delay }) => ({
  fontSize: '3.5rem',
  fontWeight: 800,
  fontFamily: '"Arial Black", sans-serif',
  color: 'rgba(255, 255, 255, 0.3)',
  animation: `${letterGlow} 1.5s ease-in-out infinite`,
  animationDelay: delay,
  transition: 'all 0.3s ease',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '0%',
    height: '3px',
    backgroundColor: '#3b82f6',
    animation: `${letterGlow} 1.5s ease-in-out infinite`,
    animationDelay: delay,
  }
}));

export const GlobalSpinner = () => {
  const { isLoading } = useLoading();

  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.modal + 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(4px)',
      }}
      open={isLoading}
    >
      <SigamLoaderContainer>
        {['S', 'I', 'G', 'A', 'M'].map((letter, index) => (
          <Letter key={index} delay={`${index * 0.15}s`}>
            {letter}
          </Letter>
        ))}
      </SigamLoaderContainer>
    </Backdrop>
  );
};
