import styled from 'styled-components';

export const Label = styled.label`
  font-family: var(--font-primary);
  color: #b8941f;
  font-size: var(--fs-sm);
`;

export const Input = styled.input`
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(212,175,55,0.35);
  background: linear-gradient(145deg, rgba(0,0,0,0.82), rgba(18,18,18,0.95));
  color: #e8c86a;
  outline-offset: 2px;
  &::placeholder { color: #9f8120; opacity: 0.9; }
`;

export default { Label, Input };
