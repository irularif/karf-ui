import type { IconType } from '../Icon';

type ListIcon = Record<string, any>;

const customIcons: Record<string, ListIcon> = {};

export const registerIcon = (id: string, customIcon: ListIcon) => {
  customIcons[id] = customIcon;
};

export const getIconType = (type: IconType = 'ionicon', name: string): any => {
  switch (type) {
    case 'zocial':
      return require('react-native-vector-icons/Zocial').default;
    case 'octicon':
      return require('react-native-vector-icons/Octicons').default;
    case 'material':
      return require('react-native-vector-icons/MaterialIcons').default;
    case 'material-community':
      return require('react-native-vector-icons/MaterialCommunityIcons').default;
    case 'ionicon':
      return require('react-native-vector-icons/Ionicons').default;
    case 'foundation':
      return require('react-native-vector-icons/Foundation').default;
    case 'evilicon':
      return require('react-native-vector-icons/EvilIcons').default;
    case 'entypo':
      return require('react-native-vector-icons/Entypo').default;
    case 'font-awesome':
      return require('react-native-vector-icons/FontAwesome').default;
    case 'font-awesome-5':
      return require('react-native-vector-icons/FontAwesome5').default;
    case 'simple-line-icon':
      return require('react-native-vector-icons/SimpleLineIcons').default;
    case 'feather':
      return require('react-native-vector-icons/Feather').default;
    case 'antdesign':
    case 'ant-design':
      return require('react-native-vector-icons/AntDesign').default;
    case 'fontisto':
      return require('react-native-vector-icons/Fontisto').default;
    default:
      if (Object.prototype.hasOwnProperty.call(customIcons, type)) {
        if (Object.prototype.hasOwnProperty.call(customIcons[type], name)) {
          return customIcons[type][name];
        }
        return customIcons[type];
      }
      return require('react-native-vector-icons/Ionicons').default;
  }
};

export const getIconStyle = (type: IconType = 'ionicon', extraProps: any) => {
  switch (type) {
    case 'zocial':
      return {};
    case 'octicon':
      return {};
    case 'material':
      return {};
    case 'material-community':
      return {};
    case 'ionicon':
      return {};
    case 'foundation':
      return {};
    case 'evilicon':
      return {};
    case 'entypo':
      return {};
    case 'font-awesome':
      return {};
    case 'font-awesome-5':
      return {
        solid: extraProps.solid || false,
        brand: extraProps.brand || false,
      };
    case 'simple-line-icon':
      return {};
    case 'feather':
      return {};
    case 'antdesign':
    case 'ant-design':
      return {};
    case 'fontisto':
      return {};
    default:
      return {};
  }
};
