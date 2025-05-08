import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Features = () => {
  const navigate = useNavigate();

  const handleGeneratePassword = () => {
    navigate('/features/generate');
  };

  const handleBreachCheck = () => {
    navigate('/features/breach');
  };

  const handleStrengthCheck = () => {
    navigate('/features/strength');
  };

  return (
    <FeatureWrapper>
      <h1>Some features</h1>
      <p className="subtitle">Secure your digital life with our powerful tools</p>
      
      <FeaturesGrid>
        <FeatureCard>
          <button className="button" onClick={handleGeneratePassword}>
            Generate Password
          </button>
          <p className="description">
            Create ultra-secure passwords with our advanced generator that combines random characters, numbers, and special symbols.
          </p>
        </FeatureCard>

        <FeatureCard>
          <button className="button" onClick={handleBreachCheck}>
            Breach Check
          </button>
          <p className="description">
            Check if your passwords have been compromised in known data breaches. We'll search across public database using haveibeenpawned API of breached credentials.
          </p>
        </FeatureCard>

        <FeatureCard>
          <button className="button" onClick={handleStrengthCheck}>
            Strength Check
          </button>
          <p className="description">
            Test how strong your existing passwords are against brute force attacks and get personalized recommendations.
          </p>
        </FeatureCard>

      </FeaturesGrid>
    </FeatureWrapper>
  );
};

const FeatureWrapper = styled.div`
  text-align: center;
  padding: 50px 20px;
  background-color: rgba(255, 255, 255, 0.05);
  min-height: 90vh;

  h1 {
    margin-bottom: 10px;
    margin-top: 5px;
    opacity: 0.9; 
    color: white;
    font-size: 3.5rem;
    font-weight: 300;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  .subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.2rem;
    margin-bottom: 50px;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
`;

const FeatureCard = styled.div`
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: transform 0.3s, background-color 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-5px);
  }

  .button {
    display: block;
    margin: 0 auto 15px;
    padding: 15px 30px;
    font-size: 1rem;
    background-color: #8b4513;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
    width: 220px;
    font-weight: 500;

    &:hover {
      background-color: #a0522d;
    }
  }

  .description {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    line-height: 1.6;
    margin: 0;
    text-align: center;
  }
`;

export default Features;