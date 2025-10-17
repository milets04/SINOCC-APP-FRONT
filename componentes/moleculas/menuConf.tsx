import BotonHeader from '@/componentes/atomos/icons';
import Subtitulo from '@/componentes/atomos/subtitulo';
import Switch from '@/componentes/atomos/switch';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

type IconLibrary = "feather" | "materialCommunity" | "evil" | "material";
type HeaderIconName = "bell" | "settings" | "pencil-outline" | "location" | "cancel";

interface SettingsItemProps {
  icon: HeaderIconName;
  iconLibrary?: IconLibrary;
  iconColor?: string;
  title: string;
  description: string;
  switchValue: boolean;
  onSwitchChange: (value: boolean) => void;
  containerStyle?: ViewStyle;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  iconLibrary = "feather",
  iconColor = "#146BF6",
  title,
  description,
  switchValue,
  onSwitchChange,
  containerStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.leftSection}>
        <BotonHeader
          icon={icon}
          library={iconLibrary}
          color={iconColor}
          size={30}
        />
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Subtitulo>{description}</Subtitulo>
        </View>
      </View>

      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColorActive="#000000"
        trackColorInactive="#000000"
        thumbColor="#FFFFFF"
        width={60}
        height={34}
        circleSize={26}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffffff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Almarai',
    marginBottom: 2,
  },
});

export default SettingsItem;