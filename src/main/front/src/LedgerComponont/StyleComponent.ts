import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Wrapper = styled(motion.div)`
  display: flex;
  width: 100vw;
  height: 72vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export const SlideWrap = styled.div`
  width: 90%;
  height: 700px;
`;

export const Box = styled(motion.div)`
  position: absolute;
  width: 90%;
  height: 700px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;


