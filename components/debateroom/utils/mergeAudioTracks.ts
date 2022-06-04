export const mergeAudioTracks = (
  stream: MediaStream | undefined,
  peerStream: MediaStream | undefined,
  setMergedAudioTracks: (params: MediaStreamTrack[] | undefined) => void,
) => {
  const merge = (
    stream: MediaStream | undefined,
    peerStream: MediaStream | undefined,
  ) => {
    if (stream && peerStream) {
      const ctx = new AudioContext();
      const destination = ctx.createMediaStreamDestination();

      const source1 = ctx.createMediaStreamSource(stream);
      const source1Gain = ctx.createGain();
      source1.connect(source1Gain).connect(destination);

      const source2 = ctx.createMediaStreamSource(peerStream);
      const source2Gain = ctx.createGain();
      source2.connect(source2Gain).connect(destination);

      return destination.stream.getAudioTracks();
    }
  };

  if (stream && peerStream) {
    setMergedAudioTracks(merge(stream, peerStream));
  }
};
