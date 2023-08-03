import React from 'react';

import { Alert, ImageBackground, StyleSheet, Text, View } from 'react-native';

import { TouchableOpacity } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import { lookup } from 'mime-types';

import { useTheme } from '../../../contexts/themeContext/ThemeContext';
import { Recorder } from '../../../icons';
import type { Asset, File } from '../../../types/types';
import { vw } from '../../../utils/utils';

type AttachmentPickerItemType = {
  asset: Asset;
  ImageOverlaySelectedComponent: React.ComponentType;
  maxNumberOfFiles: number;
  numberOfUploads: number;
  selected: boolean;
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setSelectedImages: React.Dispatch<React.SetStateAction<Asset[]>>;
  numberOfAttachmentPickerImageColumns?: number;
};

type AttachmentImageProps = Omit<AttachmentPickerItemType, 'setSelectedFiles'>;

type AttachmentVideoProps = Omit<AttachmentPickerItemType, 'setSelectedImages'>;

const AttachmentVideo: React.FC<AttachmentVideoProps> = (props) => {
  const {
    asset,
    ImageOverlaySelectedComponent,
    maxNumberOfFiles,
    numberOfAttachmentPickerImageColumns,
    numberOfUploads,
    selected,
    setSelectedFiles,
  } = props;

  const {
    theme: {
      attachmentPicker: { durationText, image, imageOverlay },
      colors: { overlay, white },
    },
  } = useTheme();

  const { duration: videoDuration, uri } = asset;

  const ONE_HOUR_IN_SECONDS = 3600;

  let durationLabel = '00:00';

  if (videoDuration) {
    const isDurationLongerThanHour = videoDuration / ONE_HOUR_IN_SECONDS >= 1;
    const formattedDurationParam = isDurationLongerThanHour ? 'HH:mm:ss' : 'mm:ss';
    const formattedVideoDuration = dayjs
      .duration(videoDuration, 'second')
      .format(formattedDurationParam);
    durationLabel = formattedVideoDuration;
  }

  const size = vw(100) / (numberOfAttachmentPickerImageColumns || 3) - 2;

  const onPressVideo = () => {
    if (selected) {
      setSelectedFiles((files) => files.filter((file) => file.uri !== asset.uri));
    } else {
      setSelectedFiles((files) => {
        if (numberOfUploads >= maxNumberOfFiles) {
          Alert.alert('Maximum number of files reached');
          return files;
        }
        // We need a mime-type to upload a video file.
        const mimeType = lookup(asset.filename) || 'multipart/form-data';
        return [
          ...files,
          {
            duration: durationLabel,
            id: asset.id,
            mimeType,
            name: asset.filename,
            size: asset.fileSize,
            uri: asset.uri,
          },
        ];
      });
    }
  };

  return (
    <TouchableOpacity onPress={onPressVideo}>
      <ImageBackground
        source={{ uri }}
        style={[
          {
            height: size,
            margin: 1,
            width: size,
          },
          image,
        ]}
      >
        {selected && (
          <View style={[styles.overlay, { backgroundColor: overlay }, imageOverlay]}>
            <ImageOverlaySelectedComponent />
          </View>
        )}
        <View style={styles.videoView}>
          <Recorder height={20} pathFill={white} width={25} />
          {videoDuration ? (
            <Text style={[styles.durationText, durationText, { color: white }]}>
              {durationLabel}
            </Text>
          ) : null}
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const AttachmentImage: React.FC<AttachmentImageProps> = (props) => {
  const {
    asset,
    ImageOverlaySelectedComponent,
    maxNumberOfFiles,
    numberOfAttachmentPickerImageColumns,
    numberOfUploads,
    selected,
    setSelectedImages,
  } = props;
  const {
    theme: {
      attachmentPicker: { image, imageOverlay },
      colors: { overlay },
    },
  } = useTheme();

  const size = vw(100) / (numberOfAttachmentPickerImageColumns || 3) - 2;

  const { uri } = asset;

  const onPressImage = () => {
    if (selected) {
      setSelectedImages((images) => images.filter((image) => image.uri !== asset.uri));
    } else {
      setSelectedImages((images) => {
        if (numberOfUploads >= maxNumberOfFiles) {
          Alert.alert('Maximum number of files reached');
          return images;
        }
        return [...images, asset];
      });
    }
  };

  return (
    <TouchableOpacity onPress={onPressImage}>
      <ImageBackground
        source={{ uri }}
        style={[
          {
            height: size,
            margin: 1,
            width: size,
          },
          image,
        ]}
      >
        {selected && (
          <View style={[styles.overlay, { backgroundColor: overlay }, imageOverlay]}>
            <ImageOverlaySelectedComponent />
          </View>
        )}
      </ImageBackground>
    </TouchableOpacity>
  );
};

export const renderAttachmentPickerItem = ({ item }: { item: AttachmentPickerItemType }) => {
  const {
    asset,
    ImageOverlaySelectedComponent,
    maxNumberOfFiles,
    numberOfAttachmentPickerImageColumns,
    numberOfUploads,
    selected,
    setSelectedFiles,
    setSelectedImages,
  } = item;

  /**
   * Expo Media Library - Result of asset type
   * Native Android - Gives mime type(Eg: image/jpeg, video/mp4, etc.)
   * Native iOS - Gives `image` or `video`
   * Expo Android/iOS - Gives `photo` or `video`
   **/
  const isVideoType = asset.type.includes('video');

  if (isVideoType) {
    return (
      <AttachmentVideo
        asset={asset}
        ImageOverlaySelectedComponent={ImageOverlaySelectedComponent}
        maxNumberOfFiles={maxNumberOfFiles}
        numberOfAttachmentPickerImageColumns={numberOfAttachmentPickerImageColumns}
        numberOfUploads={numberOfUploads}
        selected={selected}
        setSelectedFiles={setSelectedFiles}
      />
    );
  }

  return (
    <AttachmentImage
      asset={asset}
      ImageOverlaySelectedComponent={ImageOverlaySelectedComponent}
      maxNumberOfFiles={maxNumberOfFiles}
      numberOfAttachmentPickerImageColumns={numberOfAttachmentPickerImageColumns}
      numberOfUploads={numberOfUploads}
      selected={selected}
      setSelectedImages={setSelectedImages}
    />
  );
};

const styles = StyleSheet.create({
  durationText: {
    fontWeight: 'bold',
  },
  overlay: {
    alignItems: 'flex-end',
    flex: 1,
  },
  videoView: {
    bottom: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    position: 'absolute',
    width: '100%',
  },
});
