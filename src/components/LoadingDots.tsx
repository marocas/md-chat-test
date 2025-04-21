import { Box, keyframes, styled } from '@mui/material'
import { FC } from 'react'

const LoadingDots: FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
      }}
    >
      <Dots />
    </Box>
  )
}

export default LoadingDots

const dotFlashing = keyframes`
  0% {
    background-color: #9880ff;
  }
  50%, 100% {
    background-color: rgba(152, 128, 255, 0.2);
  }
`

const Dots = styled(Box)({
  position: 'relative',
  width: 10,
  height: 10,
  borderRadius: 5,
  backgroundColor: '#9880ff',
  color: '#9880ff',
  animation: `${dotFlashing} 1s infinite linear alternate`,
  animationDelay: '0.5s',

  '&::before, &::after': {
    content: '""',
    display: 'inline-block',
    position: 'absolute',
    top: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'currentColor',
    color: 'currentColor',
    animation: `${dotFlashing} 1s infinite alternate`,
  },

  '&::before': {
    left: -15,
    animationDelay: '0s',
  },
  '&::after': {
    left: 15,
    animationDelay: '1s',
  },
})
