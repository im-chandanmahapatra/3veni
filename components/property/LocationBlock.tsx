import ClientSlot from '@/components/ui/ClientSlot';
import MapEmbed from '@/components/property/MapEmbed';
import type { Parcel } from '@/types/parcel';

/** Location block (plan B13): a click-to-load map only when real coordinates exist; otherwise a marked slot in preview. */
export default function LocationBlock({ parcel }: { parcel: Parcel }) {
  if (parcel.geo) {
    return (
      <div className="detail-block">
        <h2 className="t-display-md">Location</h2>
        {parcel.address ? (
          <p className="t-body">{[parcel.address.street, parcel.address.locality, parcel.address.region, parcel.address.postalCode].filter(Boolean).join(', ')}</p>
        ) : null}
        <MapEmbed lat={parcel.geo.lat} lng={parcel.geo.lng} label={parcel.name} />
      </div>
    );
  }
  return <ClientSlot id="coordinates" />;
}
