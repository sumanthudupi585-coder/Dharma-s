import styled from 'styled-components';
import { colors, spacing, radius, shadows } from '../tokens';

const Card = styled.div`
  border: 1px solid rgba(212,175,55,0.3);
  border-radius: ${radius.lg};
  background: linear-gradient(145deg, rgba(0,0,0,0.88), rgba(12,12,12,0.96));
  padding: ${spacing.lg};
  box-shadow: 0 10px 26px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
  backdrop-filter: blur(8px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08);
  }
`;

export default Card;
