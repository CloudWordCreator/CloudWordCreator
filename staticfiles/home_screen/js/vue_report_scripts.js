const { createApp } = Vue;

const speeddial = createApp({
    data() {
        return {
            items: [
                {
                    label: 'report',
                    icon: 'pi pi-envelope',
                    command: () => {
                        window.location.href = '/home/report';
                    }
                },
                {
                    label: 'login',
                    icon: 'pi pi-sign-in',
                    command: () => {
                        window.location.href = '/login';
                    }
                },
                {
                    label: 'home',
                    icon: 'pi pi-home',
                    command: () => {
                        window.location.href = '/home';
                    }
                },
            ]
        }
    },
});

speeddial.use(PrimeVue.Config, {
    theme: {
        preset: PrimeVue.Themes.Aura,
    },
});
speeddial.component('p-speeddial', PrimeVue.SpeedDial);
speeddial.mount('#speeddial');