<template>
  <YandexMap
    v-if="isMounted"
    :controls="[]"
    :coords="mapCoords"
    :style="{ height: `${height}px` }"
    :zoom="zoom"
    @click="handleMapClick"
    @map-was-initialized="mapWasInitialized"
  >
    <YmapMarker
      v-if="value"
      :coords="value"
      marker-id="point"
      @click="handleMarkerClick"
    />
  </YandexMap>
</template>

<script setup lang="ts">
import { yandexMap as YandexMap, ymapMarker as YmapMarker } from 'vue-yandex-maps';
import { useInjectFormItemContext } from 'ant-design-vue/es/form/FormItemContext';
import { DEFAULT_MAP_POINT } from '@/shared/config/constants';

const props = withDefaults(defineProps<{
  readonly?: boolean
  value?: number[]
  defaultCity?: string
  zoom?: number
  height?: number
}>(), {
  readonly: false,
  value: undefined,
  defaultCity: '',
  zoom: 10,
  height: 400,
});

const emit = defineEmits(['update:value']);

const formItemContext = useInjectFormItemContext();
const map = ref();
const isMounted = ref(false);
const mapCoords = ref(DEFAULT_MAP_POINT);

onMounted(() => isMounted.value = true);

function updatePoint(coords: number[]) {
  if (props.readonly)
    return;
  emit('update:value', coords);
  formItemContext.onFieldChange();
}

function handleMapClick(ev: any) {
  if (!ev.get)
    return;

  mapCoords.value = ev.get('coords');
  updatePoint(ev.get('coords'));
}

function handleMarkerClick(ev: any) {
  updatePoint([]);
}

async function updateMapCoords() {
  const res = await (window as any).ymaps.geocode(props.defaultCity, { result: 1 });

  const firstGeoObject = res.geoObjects.get(0);
  const objCoords = firstGeoObject?.geometry.getCoordinates();

  if (objCoords)
    mapCoords.value = objCoords;
}

function mapWasInitialized(mapValue: any) {
  map.value = mapValue;

  if (props.value.length !== 0) {
    mapCoords.value = props.value;
    return;
  }

  if (!props.defaultCity)
    return;

  updateMapCoords();
}

watch(() => props.defaultCity, (_val, oldVal) => {
  if (oldVal)
    updatePoint([]);

  updateMapCoords();
});
</script>
