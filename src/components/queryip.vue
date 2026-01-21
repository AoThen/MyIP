<template>
    <!-- Search BTN -->
    <button
        class="btn btn-primary position-fixed"
        style="bottom: 20px; right: 20px; z-index: 1050"
        data-bs-toggle="modal"
        data-bs-target="#IPCheck"
        @click="$trackEvent('SideButtons', 'ToggleClick', 'QueryIP')"
    >
        <i class="bi bi-search" />
    </button>

    <!-- Search Modal -->
    <div id="IPCheck" class="modal fade" tabindex="-1" aria-labelledby="IPCheck" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" :class="{ 'dark-mode dark-mode-border': isDarkMode }">
                <div class="modal-header" :class="{ 'dark-mode-border': isDarkMode }">
                    <h5 id="IPCheck" class="modal-title">
                        {{ $t('ipcheck.Title') }}
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        :class="{ 'dark-mode-close-button': isDarkMode }"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    />
                </div>
                <div class="modal-body" :class="{ 'dark-mode': isDarkMode }">
                    <input
                        id="inputIP"
                        v-model="inputIP"
                        type="text"
                        class="form-control mb-2"
                        :class="{ 'dark-mode': isDarkMode }"
                        :placeholder="$t('ipcheck.Placeholder')"
                        name="inputIP"
                        @keyup.enter="submitQuery"
                    />
                    <div v-if="modalQueryError" class="text-danger">
                        {{ modalQueryError }}
                    </div>
                    <div v-if="modalQueryResult" class="mt-2">
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item jn-list-group-item" :class="{ 'dark-mode': isDarkMode }">
                                    <span class="jn-text">🌍 {{ $t('ipInfos.Country') }}</span>
                                    modalQueryResult.country_name }}&nbsp;
                                    <span
                                        v-if="modalQueryResult.country_code"
                                        :class="'fi fi-' + modalQueryResult.country_code.toLowerCase()"
                                    />
                                </li>
                                <li class="list-group-item jn-list-group-item" :class="{ 'dark-mode': isDarkMode }">
                                    <span class="jn-text">🏚️ {{ $t('ipInfos.Region') }}</span>
                                    : {{ modalQueryResult.region }}
                                </li>
                                <li class="list-group-item jn-list-group-item" :class="{ 'dark-mode': isDarkMode }">
                                    <span class="jn-text">🚏 {{ $t('ipInfos.City') }}</span>
                                    : {{ modalQueryResult.city }}
                                </li>
                                <li class="list-group-item jn-list-group-item" :class="{ 'dark-mode': isDarkMode }">
                                    <span class="jn-text">🏢 {{ $t('ipInfos.ISP') }}</span>
                                    : {{ modalQueryResult.isp }}
                                </li>
                                <li class="list-group-item jn-list-group-item" :class="{ 'dark-mode': isDarkMode }">
                                    <span class="jn-text">📶 {{ $t('ipInfos.ASN') }}</span>
                                    :
                                    <a v-if="modalQueryResult.asnlink" :href="modalQueryResult.asnlink" target="_blank">
                                        {{ modalQueryResult.asn }}
                                    </a>
                                    <a v-else>{{ modalQueryResult.asn }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" :class="{ 'dark-mode-border': isDarkMode }">
                    <button
                        type="button"
                        class="btn btn-primary"
                        :class="{ 'btn-secondary': !isValidIP(inputIP), 'btn-primary': isValidIP(inputIP) }"
                        :disabled="!isValidIP(inputIP)"
                        @click="submitQuery"
                    >
                        {{ $t('ipcheck.Button') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import { Modal } from 'bootstrap'

export default {
    name: 'QueryIP',

    // 引入 Store
    setup() {
        const store = useStore()
        const isDarkMode = computed(() => store.state.isDarkMode)
        const isMobile = computed(() => store.state.isMobile)

        return {
            isDarkMode,
            isMobile
        }
    },

    data() {
        return {
            inputIP: '',
            modalQueryResult: null,
            modalQueryError: ''
        }
    },

    methods: {
        // 查询 IP 信息
        async submitQuery() {
            if (this.isValidIP(this.inputIP)) {
                this.modalQueryError = ''
                this.modalQueryResult = null
                await this.fetchIPForModal(this.inputIP)
            } else {
                this.modalQueryError = this.$t('ipcheck.Error')
                this.modalQueryResult = null
            }
        },

        // 重置 modalQueryResult
        setupModalEventListener() {
            const modalElement = document.getElementById('IPCheck')
            modalElement.addEventListener('hidden.bs.modal', this.resetModalData)
        },

        // 验证 IP 地址合法性
        isValidIP(ip) {
            const ipv4Pattern =
                /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
            const ipv6Pattern =
                /^(([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4})|(([0-9a-fA-F]{1,4}:){0,6}([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:){0,6}([0-9a-fA-F]{1,4})?))$/
            return ipv4Pattern.test(ip) || ipv6Pattern.test(ip)
        },

        // 转换 IP 信息
        transformDataFromIPapi(data) {
            if (data.error) {
                throw new Error(data.reason)
            }

            return {
                 country_name: data.country_name || '',
                 country_code: data.country || '',
                 region: data.region || '',
                 city: data.city || '',
                 latitude: data.latitude || '',
                 longitude: data.longitude || '',
                 isp: data.org || '',
                 asn: data.asn || '',
                 asnlink: data.asn ? `https://radar.cloudflare.com/traffic/${data.asn}` : false
             }
        },

        // 获取 IP 信息
        async fetchIPForModal(ip) {
            const sources = [
                { url: `/api/ipinfo?ip=${ip}`, transform: this.transformDataFromIPapi },
                { url: `/api/ipapicom?ip=${ip}`, transform: this.transformDataFromIPapi },
                { url: `https://ipapi.co/${ip}/json/`, transform: this.transformDataFromIPapi },
                { url: `api/keycdn?ip=${ip}`, transform: this.transformDataFromIPapi }
            ]

            for (const source of sources) {
                try {
                    const response = await fetch(source.url)
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }
                    const data = await response.json()
                    if (data.error) {
                        throw new Error(data.reason || 'IP lookup failed')
                    }

                    // 使用对应的转换函数更新 modalQueryResult
                    this.modalQueryResult = source.transform(data)
                    break
                } catch (error) {
                    console.error('Error fetching IP details:', error)
                }
            }
        }
    }
}
</script>

<style scoped></style>
