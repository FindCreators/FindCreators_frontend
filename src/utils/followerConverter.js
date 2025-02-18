export default function followerConverter(num) {
    if (num < 1000) {
      return num.toString();
    } else if (num < 1000000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    } else if (num < 1000000000) {
      return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
    } else if (num < 1000000000000) {
      return (num / 1000000000).toFixed(1).replace('.0', '') + 'B';
    } else {
      return (num / 1000000000000).toFixed(1).replace('.0', '') + 'T';
    }
  }