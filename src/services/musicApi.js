import tracks from '../data/tracks.json';
import playlists from '../data/playlists.json';
import albums from '../data/albums.json';
import artists from '../data/artists.json';
import categories from '../data/categories.json';

// Async wrapper simulating network latency and mock responses
export const musicApi = {
  getInitialCatalog: async () => {
    // Return all initial normalized datasets
    return {
      tracks,
      playlists,
      albums,
      artists,
      categories,
    };
  },

  searchCatalog: async (query) => {
    const q = (query || '').toLowerCase().trim();
    if (!q) {
      return { tracks: [], artists: [], albums: [], playlists: [] };
    }

    const matchedTracks = tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        t.album.toLowerCase().includes(q)
    );

    const matchedArtists = artists.filter((a) => a.name.toLowerCase().includes(q));

    const matchedAlbums = albums.filter(
      (al) => al.title.toLowerCase().includes(q) || al.artistName.toLowerCase().includes(q)
    );

    const matchedPlaylists = playlists.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );

    return {
      tracks: matchedTracks,
      artists: matchedArtists,
      albums: matchedAlbums,
      playlists: matchedPlaylists,
    };
  },
};

export default musicApi;
