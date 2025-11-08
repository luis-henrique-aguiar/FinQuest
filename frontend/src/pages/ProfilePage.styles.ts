import styled from 'styled-components';
import Card from '../components/common/Card';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

export const ProfileHeader = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

export const AvatarContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.colors.primary}33;
`;

export const LevelBadge = styled.div`
  position: absolute;
  bottom: 0px;
  right: -10px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 2px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.small};
  z-index: 1;
`;

export const UserName = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

export const UserTitle = styled.p`
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: 1rem;
`;

export const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const ProgressWrapper = styled.div`
  width: 80%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const SectionTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
`;

export const BadgesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

export const AchievementsSection = styled(Card)`
  display: flex;
  flex-direction: column;
`;

export const AchievementsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const Achievement = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const AchievementIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.colors.primary}22;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

export const AchievementInfo = styled.div`
  flex: 1;
`;

export const AchievementTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const AchievementDescription = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMedium};
`;

export const SettingsSection = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.background};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const SettingLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;