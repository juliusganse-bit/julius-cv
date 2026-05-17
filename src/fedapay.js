export const FEDAPAY_PUBLIC_KEY = 'pk_live_LInjWuIJS2butkQ82sKWsG9N'

export async function initierPaiement({ montant, description, email, nom, prenom, onSuccess, onError }) {
    try {
        FedaPay.init({
            public_key: FEDAPAY_PUBLIC_KEY,
            transaction: {
                amount: montant,
                description: description,
            },
            customer: {
                email: email,
                lastname: nom,
                firstname: prenom,
            },
            onComplete: function (resp) {
                if (resp.reason === FedaPay.CHECKOUT_COMPLETED) {
                    onSuccess(resp)
                } else {
                    onError(resp)
                }
            }
        }).open()
    } catch (e) {
        console.error(e)
        onError(e)
    }
}
