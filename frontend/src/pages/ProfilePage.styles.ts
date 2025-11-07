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
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  position: relative;
  overflow: hidden;
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const LevelBadge = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.textDark};
  font-size: 14px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 2px solid white;
`;

export const UserName = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
`;

export const UserTitle = styled.p`
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

export const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const SectionTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.md};
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